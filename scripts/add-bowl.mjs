import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SRC = path.join(ROOT, 'public/assets/images/PerotYeveshim/enhanced/new Photos');
const OUT = path.join(ROOT, 'public/assets/images/fruits/bowl');

const SIZE   = 720;
const CX     = SIZE / 2;
const CY     = SIZE / 2;
const RIM_R  = 288;   // outer bowl rim
const INNER_R = 264;  // inner bowl surface
const FRUIT_AREA = 430; // fruit max size inside bowl

fs.mkdirSync(OUT, { recursive: true });

function makeBowlSVG() {
  const rimHighlightX1 = Math.round(CX - RIM_R * 0.55);
  const rimHighlightY1 = Math.round(CY - RIM_R * 0.70);
  const rimHighlightX2 = Math.round(CX + RIM_R * 0.60);
  const rimHighlightY2 = Math.round(CY - RIM_R * 0.68);

  return Buffer.from(`<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Warm cream background -->
    <radialGradient id="bg" cx="50%" cy="38%" r="68%">
      <stop offset="0%"   stop-color="#fdf6ed"/>
      <stop offset="100%" stop-color="#ece0cc"/>
    </radialGradient>

    <!-- Ceramic rim (sandy beige) -->
    <radialGradient id="rim" cx="40%" cy="32%" r="62%">
      <stop offset="0%"   stop-color="#eadfc7"/>
      <stop offset="50%"  stop-color="#cfc0a0"/>
      <stop offset="100%" stop-color="#b8a880"/>
    </radialGradient>

    <!-- Inner bowl surface (lighter / warm white) -->
    <radialGradient id="inner" cx="46%" cy="40%" r="56%">
      <stop offset="0%"   stop-color="#fefaf3"/>
      <stop offset="65%"  stop-color="#f5ead8"/>
      <stop offset="100%" stop-color="#e8d9c2"/>
    </radialGradient>

    <!-- Drop shadow under bowl -->
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="3" dy="14" stdDeviation="18"
                    flood-color="rgba(60,38,8,0.30)"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>

  <!-- Bowl rim with drop shadow -->
  <circle cx="${CX}" cy="${CY}" r="${RIM_R}"
          fill="url(#rim)" filter="url(#shadow)"/>

  <!-- Inner bowl surface -->
  <circle cx="${CX}" cy="${CY + 8}" r="${INNER_R}"
          fill="url(#inner)"/>

  <!-- Subtle inner shadow ring (depth) -->
  <circle cx="${CX}" cy="${CY + 8}" r="${INNER_R}"
          fill="none"
          stroke="rgba(130,100,60,0.16)"
          stroke-width="12"/>

  <!-- Rim top-left highlight (ceramic glaze reflection) -->
  <path d="M ${rimHighlightX1} ${rimHighlightY1}
           A ${RIM_R} ${RIM_R} 0 0 1 ${rimHighlightX2} ${rimHighlightY2}"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        stroke-width="5.5"
        stroke-linecap="round"/>

  <!-- Secondary soft highlight -->
  <path d="M ${Math.round(CX - RIM_R * 0.30)} ${Math.round(CY - RIM_R * 0.78)}
           A ${RIM_R} ${RIM_R} 0 0 1 ${Math.round(CX + RIM_R * 0.10)} ${Math.round(CY - RIM_R * 0.82)}"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        stroke-width="3"
        stroke-linecap="round"/>
</svg>`);
}

async function processImage(filename) {
  const srcPath = path.join(SRC, filename);
  const baseName = filename.replace(/\.(png|PNG)$/, '');
  const outFile  = baseName + '.jpg';
  const outPath  = path.join(OUT, outFile);

  const fruitBuf = await sharp(srcPath)
    .resize(FRUIT_AREA, FRUIT_AREA, {
      fit: 'inside',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  const { width: fw, height: fh } = await sharp(fruitBuf).metadata();

  const left = Math.round((SIZE - fw) / 2);
  const top  = Math.round((SIZE - fh) / 2) - 8; // slight upward for natural centering in bowl

  await sharp(makeBowlSVG())
    .composite([{
      input: fruitBuf,
      left,
      top,
      blend: 'multiply'   // white in fruit → background shows through, colors preserved
    }])
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(outPath);

  console.log(`  ✓ ${baseName}`);
  return outFile;
}

async function main() {
  const files = fs.readdirSync(SRC).filter(f => /\.(png|PNG)$/.test(f));
  console.log(`\nProcessing ${files.length} images → ${OUT}\n`);

  for (const file of files) {
    await processImage(file);
  }

  console.log(`\nDone! ${files.length} images saved.`);
  console.log('\nFile names (for shop.json):');
  files.forEach(f => {
    const base = f.replace(/\.(png|PNG)$/, '');
    console.log(`  assets/images/fruits/bowl/${base}.jpg`);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
