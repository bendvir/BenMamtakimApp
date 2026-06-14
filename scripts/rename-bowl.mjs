import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '../public/assets/images/fruits/bowl');

const MAP = {
  'אננס מיובש.jpg':           'pineapple-bowl.jpg',
  'חמוציות ללא סוכר.jpg':     'cranberries-no-sugar-bowl.jpg',
  'חמוציות רגילות.jpg':       'cranberries-bowl.jpg',
  'מגהול גדול.jpg':            'medjool-large-bowl.jpg',
  'משמש אוזבקי חדש.jpg':      'apricot-uzbeki-bowl.jpg',
  'פאפיה מיובשת.jpg':         'papaya-bowl.jpg',
  'צימוק אוזבקי.jpg':         'raisins-uzbeki-bowl.jpg',
  'צימוק בהיר גדול.jpg':      'raisins-light-bowl.jpg',
  'צימוק פרסי.jpg':            'raisins-persian-bowl.jpg',
  'צימוק צהוב קטן.jpg':        'raisins-yellow-small-bowl.jpg',
  'שזיף בלי גרעין.jpg':       'prunes-pitted-bowl.jpg',
  'שזיף עם גרעין.jpg':         'prunes-with-pit-bowl.jpg',
  'תמר אמרי.jpg':              'dates-ameri-bowl.jpg',
  'תמר דקל נור.jpg':           'dates-dekel-nur-bowl.jpg',
};

for (const [heb, eng] of Object.entries(MAP)) {
  const src = path.join(DIR, heb);
  const dst = path.join(DIR, eng);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dst);
    console.log(`  ✓ ${heb} → ${eng}`);
  } else {
    console.log(`  ✗ not found: ${heb}`);
  }
}
console.log('\nDone.');
