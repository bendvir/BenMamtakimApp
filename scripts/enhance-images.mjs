import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const INPUT_DIR  = 'public/assets/images/PerotYeveshim';
const OUTPUT_DIR = 'public/assets/images/PerotYeveshim/enhanced';
const SIZE = 800; // square crop for consistent product cards

// Per-image overrides for very dark or special shots
const OVERRIDES = {
  'raisin-black.jpg':    { brightness: 1.35, saturation: 1.6, contrast: 1.3 },
  'prune-pitted.jpg':    { brightness: 1.30, saturation: 1.5, contrast: 1.25 },
  'plum-with-pit.jpg':   { brightness: 1.30, saturation: 1.5, contrast: 1.25 },
  'medjool-large.jpg':   { brightness: 1.20, saturation: 1.4, contrast: 1.2 },
  'cranberries-dark.jpg':{ brightness: 1.30, saturation: 1.7, contrast: 1.3 },
  'walnuts-chopped.jpg': { brightness: 1.25, saturation: 1.3, contrast: 1.2 },
  'walnuts-shell.jpg':   { brightness: 1.15, saturation: 1.3, contrast: 1.15 },
};

const DEFAULT = { brightness: 1.08, saturation: 1.35, contrast: 1.15 };

await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(INPUT_DIR))
  .filter(f => /\.(jpg|jpeg|png)$/i.test(f) && extname(f)); // skip subdirs

let ok = 0, fail = 0;

for (const file of files) {
  const src = join(INPUT_DIR, file);
  const dst = join(OUTPUT_DIR, file);
  const cfg = OVERRIDES[file] ?? DEFAULT;

  try {
    await sharp(src)
      .resize(SIZE, SIZE, {
        fit: 'cover',
        position: 'centre',
      })
      .modulate({
        brightness: cfg.brightness,
        saturation: cfg.saturation,
      })
      .linear(cfg.contrast, -(128 * (cfg.contrast - 1))) // contrast
      .sharpen({ sigma: 1.2, flat: 1, jagged: 2 })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(dst);

    console.log(`✓ ${file}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    fail++;
  }
}

console.log(`\nסיום: ${ok} הצליחו, ${fail} נכשלו`);
console.log(`תמונות משופרות נשמרו ב: ${OUTPUT_DIR}`);
