const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table for PNG writing
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(len, 0);

  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, crcData, crcBuf]);
}

function generatePng(size, drawFn) {
  const width = size;
  const height = size;

  // Raw pixel data: 1 filter byte (0) + width * 4 bytes per row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const color = drawFn(x, y, width, height);
      rawData[pixelOffset] = color.r;
      rawData[pixelOffset + 1] = color.g;
      rawData[pixelOffset + 2] = color.b;
      rawData[pixelOffset + 3] = color.a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = createChunk('IDAT', deflated);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon generator drawing gold cross and memorial seal
function memorialColor(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const radius = w * 0.44;
  const ringWidth = w * 0.035;

  // Dark background #090d16
  const bg = { r: 9, g: 13, b: 22, a: 255 };

  // Outer Golden Ring
  if (Math.abs(dist - radius) < ringWidth / 2) {
    return { r: 245, g: 158, b: 11, a: 255 }; // Amber 500
  }

  // Inner subtle border
  if (Math.abs(dist - (radius - ringWidth)) < ringWidth / 4) {
    return { r: 217, g: 119, b: 6, a: 220 };
  }

  // Central Memorial Cross / Monogram
  const crossW = w * 0.08;
  const crossH = h * 0.52;
  const barW = w * 0.40;
  const barH = h * 0.08;
  const barY = cy - h * 0.06;

  const inVertical = Math.abs(x - cx) < crossW / 2 && Math.abs(y - cy) < crossH / 2;
  const inHorizontal = Math.abs(x - cx) < barW / 2 && Math.abs(y - barY) < barH / 2;

  if (inVertical || inHorizontal) {
    return { r: 251, g: 191, b: 36, a: 255 }; // Gold Amber 400
  }

  // Soft inner circle gradient
  if (dist < radius - ringWidth) {
    const factor = dist / (radius - ringWidth);
    return {
      r: Math.floor(15 + 10 * factor),
      g: Math.floor(23 + 12 * factor),
      b: Math.floor(42 + 15 * factor),
      a: 255
    };
  }

  return bg;
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), generatePng(192, memorialColor));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), generatePng(512, memorialColor));
fs.writeFileSync(path.join(iconsDir, 'maskable-icon-512x512.png'), generatePng(512, memorialColor));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), generatePng(180, memorialColor));

console.log('Successfully generated PWA icons in public/icons/');
