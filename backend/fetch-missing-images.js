/**
 * מחפש תמונות אוטומטית ב-Open Food Facts למוצרים ללא תמונה
 * מעלה ל-Cloudinary ומעדכן MongoDB
 * הרץ: node backend/fetch-missing-images.js
 */
require('dotenv').config({ path: __dirname + '/.env' });

const mongoose   = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Product    = require('./models/Product');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function searchOpenFoodFacts(query) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,brands,image_front_url,image_url`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'MamtakimApp/1.0' } });
  const data = await resp.json();
  const product = (data.products || []).find(p => p.image_front_url || p.image_url);
  return product ? (product.image_front_url || product.image_url) : null;
}

async function uploadToCloudinary(imageUrl) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      { folder: 'mamtakim', resource_type: 'image', use_filename: false },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    );
  });
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🍃 MongoDB מחובר\n');

  const missing = await Product.find({
    $or: [{ image_url: '' }, { image_url: null }, { image_url: { $exists: false } }]
  });

  if (missing.length === 0) {
    console.log('✅ כל המוצרים כבר יש להם תמונה!');
    await mongoose.disconnect();
    return;
  }

  console.log(`🔍 נמצאו ${missing.length} מוצרים ללא תמונה:\n`);

  const report = { found: [], notFound: [] };

  for (const product of missing) {
    process.stdout.write(`  [${product.id}] ${product.title} ... `);
    try {
      const imageUrl = await searchOpenFoodFacts(product.title);
      if (!imageUrl) {
        console.log('⚠️  לא נמצא');
        report.notFound.push(product.title);
        continue;
      }

      const cloudUrl = await uploadToCloudinary(imageUrl);
      await Product.updateOne(
        { id: product.id },
        { $set: { image_url: cloudUrl, updated_at: new Date().toISOString() } }
      );
      console.log('✅');
      report.found.push(product.title);

      await new Promise(r => setTimeout(r, 500)); // delay between requests
    } catch (err) {
      console.log(`❌ שגיאה: ${err.message}`);
      report.notFound.push(product.title);
    }
  }

  console.log('\n──────────────────────────────────');
  console.log(`✅ נמצאו ועודכנו: ${report.found.length}`);
  console.log(`⚠️  לא נמצאו:     ${report.notFound.length}`);

  if (report.notFound.length > 0) {
    console.log('\nמוצרים שדורשים תמונה ידנית:');
    report.notFound.forEach(t => console.log(`  • ${t}`));
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
