/**
 * זרע חטיפים מלוחים של עלית ואסם לקטגוריית chocolates
 * הרץ: node backend/seed-snacks.js
 */
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const Counter  = require('./models/Counter');

const CATEGORY = 'chocolates'; // שוקולדים וממתקים

const SNACKS = [
  // ── במבה (אסם) ────────────────────────────────────────────────────────────
  { title: 'במבה אסם', price: 2.90, price_type: 1, description: 'חטיף בוטנים קלאסי של אסם' },
  { title: 'במבה ממולאת שוקולד', price: 3.50, price_type: 1, description: 'במבה עם מילוי שוקולד' },
  { title: 'במבה גדולה', price: 8.90, price_type: 1, description: 'אריזה משפחתית במבה קלאסי' },
  { title: 'במבה פיצוחים', price: 3.90, price_type: 1, description: 'במבה עם טעם פיצוחים' },

  // ── ביסלי (אסם) ───────────────────────────────────────────────────────────
  { title: 'ביסלי גריל', price: 3.90, price_type: 1, description: 'חטיף ביסלי בטעם גריל' },
  { title: 'ביסלי פיצה', price: 3.90, price_type: 1, description: 'חטיף ביסלי בטעם פיצה' },
  { title: 'ביסלי פיקנטי', price: 3.90, price_type: 1, description: 'חטיף ביסלי חריף' },
  { title: 'ביסלי בצל', price: 3.90, price_type: 1, description: 'חטיף ביסלי בטעם בצל' },
  { title: 'ביסלי גדול גריל', price: 9.90, price_type: 1, description: 'אריזה משפחתית ביסלי גריל' },

  // ── ציפס ──────────────────────────────────────────────────────────────────
  { title: 'ציפס מלח', price: 5.90, price_type: 1, description: 'ציפס תפוחי אדמה מלח קלאסי' },
  { title: 'ציפס פפריקה', price: 5.90, price_type: 1, description: 'ציפס בטעם פפריקה' },
  { title: 'ציפס גבינה', price: 5.90, price_type: 1, description: 'ציפס בטעם גבינה' },
  { title: "ציפס כמהין", price: 7.90, price_type: 1, description: "ציפס פרמיום בטעם כמהין" },
  { title: 'ציפס חמוץ', price: 5.90, price_type: 1, description: 'ציפס בטעם חמוץ' },
  { title: 'ציפס אצות', price: 7.90, price_type: 1, description: 'ציפס בטעם אצות ים' },

  // ── דוריטוס ───────────────────────────────────────────────────────────────
  { title: 'דוריטוס פפריקה', price: 8.90, price_type: 1, description: 'חטיף תירס דוריטוס בטעם פפריקה' },
  { title: 'דוריטוס גבינה', price: 8.90, price_type: 1, description: 'חטיף תירס דוריטוס בטעם גבינה' },
  { title: 'דוריטוס חריף', price: 8.90, price_type: 1, description: 'דוריטוס בטעם חריף' },
  { title: 'דוריטוס נאצ\'וס', price: 8.90, price_type: 1, description: 'דוריטוס נאצ\'וס קלאסי' },

  // ── עלית ──────────────────────────────────────────────────────────────────
  { title: 'טגלית מלח', price: 4.90, price_type: 1, description: 'חטיף תירס טגלית עלית מלח' },
  { title: 'טגלית גבינה', price: 4.90, price_type: 1, description: 'חטיף תירס טגלית עלית גבינה' },
  { title: 'טגלית פיקנטי', price: 4.90, price_type: 1, description: 'חטיף תירס טגלית עלית חריף' },
  { title: 'עקיצה', price: 3.90, price_type: 1, description: 'חטיף עקיצה עלית' },
  { title: 'פופקורן חמאה', price: 4.90, price_type: 1, description: 'פופקורן בטעם חמאה' },
  { title: 'פופקורן מלח', price: 4.90, price_type: 1, description: 'פופקורן מלח קלאסי' },

  // ── חטיפים נוספים ─────────────────────────────────────────────────────────
  { title: 'פרינגלס מקורי', price: 12.90, price_type: 1, description: 'ציפס פרינגלס טעם מקורי' },
  { title: 'פרינגלס גבינה', price: 12.90, price_type: 1, description: 'ציפס פרינגלס טעם גבינה' },
  { title: 'ניבס מלח', price: 4.90, price_type: 1, description: 'חטיף ניבס מלח קלאסי' },
  { title: 'ניבס גבינה', price: 4.90, price_type: 1, description: 'חטיף ניבס גבינה' },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🍃 MongoDB מחובר\n');

  let added = 0, skipped = 0;

  for (const snack of SNACKS) {
    const exists = await Product.findOne({ title: snack.title });
    if (exists) { console.log(`  ⏭  כבר קיים: ${snack.title}`); skipped++; continue; }

    const counter = await Counter.findByIdAndUpdate(
      'productId',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    await Product.create({
      id:          counter.seq,
      title:       snack.title,
      price:       snack.price,
      price_type:  snack.price_type,
      category_id: CATEGORY,
      image_url:   '',
      description: snack.description,
      in_stock:    1,
      is_new:      1,
      created_at:  new Date().toISOString(),
      updated_at:  new Date().toISOString(),
    });

    console.log(`  ✅ נוסף: [${counter.seq}] ${snack.title}`);
    added++;
  }

  console.log(`\n──────────────────────────────`);
  console.log(`✅ נוספו:   ${added} מוצרים`);
  console.log(`⏭  קיימים:  ${skipped} מוצרים`);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
