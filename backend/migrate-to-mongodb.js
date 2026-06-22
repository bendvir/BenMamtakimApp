require('dotenv').config({ path: __dirname + '/.env' });

const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');

const Product  = require('./models/Product');
const Category = require('./models/Category');
const Counter  = require('./models/Counter');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🍃 MongoDB מחובר');

  const shopData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'shop.json'), 'utf8'));

  // ── Categories ───────────────────────────────────────────────────────────────
  console.log('\n📁 מייבא קטגוריות...');
  for (const cat of shopData.categories) {
    await Category.updateOne({ id: cat.id }, cat, { upsert: true });
    process.stdout.write(`  ✅ ${cat.name_he}\n`);
  }

  // ── Products ─────────────────────────────────────────────────────────────────
  console.log('\n📦 מייבא מוצרים...');
  let inserted = 0, updated = 0;
  for (const p of shopData.products) {
    const res = await Product.updateOne({ id: p.id }, p, { upsert: true });
    if (res.upsertedCount) inserted++;
    else updated++;
    process.stdout.write(`  ${res.upsertedCount ? '✅' : '🔄'} [${p.id}] ${p.title}\n`);
  }

  // ── Counter ──────────────────────────────────────────────────────────────────
  const maxId = Math.max(...shopData.products.map(p => p.id));
  await Counter.updateOne({ _id: 'productId' }, { seq: shopData._nextId || maxId + 1 }, { upsert: true });

  console.log('\n──────────────────────────────');
  console.log(`✅ נוספו:    ${inserted} מוצרים`);
  console.log(`🔄 עודכנו:   ${updated} מוצרים`);
  console.log(`🏷️  קטגוריות: ${shopData.categories.length}`);
  console.log(`🔢 Counter:  ${shopData._nextId}`);
  console.log('\nהמיגרציה הושלמה! 🎉');

  await mongoose.disconnect();
}

migrate().catch(err => { console.error(err); process.exit(1); });
