import fs from "fs";
import path from "path";

export interface DBTribute {
  id: string;
  author_name: string;
  relationship: string;
  location: string;
  message: string;
  candle_lit: number; // 0 or 1
  is_pinned?: number; // 0 or 1
  created_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "tributes.json");

// Clean slate: no fabricated mock tributes
const initialSeedTributes: DBTribute[] = [];

function ensureDbFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedTributes, null, 2), "utf8");
  }
}

export function getAllTributes(): DBTribute[] {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const list: DBTribute[] = JSON.parse(raw);
    return list.sort((a, b) => {
      if ((b.is_pinned || 0) !== (a.is_pinned || 0)) {
        return (b.is_pinned || 0) - (a.is_pinned || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } catch (err) {
    console.error("Failed to read database file:", err);
    return [];
  }
}

export function insertTribute(data: {
  author_name: string;
  relationship?: string;
  location?: string;
  message: string;
  candle_lit?: boolean;
}): DBTribute {
  ensureDbFile();
  const current = getAllTributes();

  const id = "trib-" + Date.now();
  const created_at = new Date().toISOString().replace("T", " ").substring(0, 16);
  const candle_lit = data.candle_lit === false ? 0 : 1;
  const relationship = data.relationship?.trim() || "Family & Well-wisher";
  const location = data.location?.trim() || "Nigeria";
  const author_name = data.author_name.trim();
  const message = data.message.trim();

  const newTribute: DBTribute = {
    id,
    author_name,
    relationship,
    location,
    message,
    candle_lit,
    is_pinned: 0,
    created_at,
  };

  const updated = [newTribute, ...current];
  const tempFile = DB_FILE + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(updated, null, 2), "utf8");
  fs.renameSync(tempFile, DB_FILE);

  return newTribute;
}

export function deleteTribute(id: string): boolean {
  ensureDbFile();
  const current = getAllTributes();
  const filtered = current.filter((t) => t.id !== id);

  if (filtered.length === current.length) {
    return false;
  }

  const tempFile = DB_FILE + ".tmp";
  fs.writeFileSync(tempFile, JSON.stringify(filtered, null, 2), "utf8");
  fs.renameSync(tempFile, DB_FILE);
  return true;
}
