Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\crest.jpg"
$src = [System.Drawing.Image]::FromFile($srcPath)

# 1. Generate standard crest PNG sizes
$sizes = @(16, 32, 48, 64, 180, 192, 512)
foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $s, $s
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $s, $s)
    $g.Dispose()
    
    $pngPath = Join-Path $PSScriptRoot "..\public\icons\crest-$s.png"
    $bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

# 2. Overwrite PWA icons with high-res crest
$pwaMap = @{
    "..\public\icons\icon-192x192.png" = 192
    "..\public\icons\icon-512x512.png" = 512
    "..\public\icons\maskable-icon-512x512.png" = 512
    "..\public\icons\apple-touch-icon.png" = 180
    "..\app\icon.png" = 192
    "..\app\apple-icon.png" = 180
}

foreach ($relPath in $pwaMap.Keys) {
    $dim = $pwaMap[$relPath]
    $bmp = New-Object System.Drawing.Bitmap $dim, $dim
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $dim, $dim)
    $g.Dispose()
    
    $outPath = Join-Path $PSScriptRoot $relPath
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

# 3. Create ICO from 32x32 bitmap
$icoBmp = New-Object System.Drawing.Bitmap 32, 32
$gIco = [System.Drawing.Graphics]::FromImage($icoBmp)
$gIco.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gIco.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gIco.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gIco.DrawImage($src, 0, 0, 32, 32)
$gIco.Dispose()

$hIcon = $icoBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

# Save to app/favicon.ico and public/favicon.ico
$appFaviconPath = Join-Path $PSScriptRoot "..\app\favicon.ico"
$pubFaviconPath = Join-Path $PSScriptRoot "..\public\favicon.ico"

$fsApp = New-Object System.IO.FileStream($appFaviconPath, [System.IO.FileMode]::Create)
$icon.Save($fsApp)
$fsApp.Close()

$fsPub = New-Object System.IO.FileStream($pubFaviconPath, [System.IO.FileMode]::Create)
$icon.Save($fsPub)
$fsPub.Close()

$icon.Dispose()
$icoBmp.Dispose()
$src.Dispose()

# 4. Also replace public/vercel.svg with an SVG that embeds the base64 crest image
$crestBytes = [System.IO.File]::ReadAllBytes($srcPath)
$b64 = [Convert]::ToBase64String($crestBytes)
$svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <clipPath id="circleClip">
      <circle cx="256" cy="256" r="256" />
    </clipPath>
  </defs>
  <image href="data:image/jpeg;base64,$b64" x="0" y="0" width="512" height="512" clip-path="url(#circleClip)" />
</svg>
"@
$vercelSvgPath = Join-Path $PSScriptRoot "..\public\vercel.svg"
[System.IO.File]::WriteAllText($vercelSvgPath, $svgContent)

Write-Output "Successfully updated all favicons, PWA icons, and vercel.svg with the family crest logo!"
