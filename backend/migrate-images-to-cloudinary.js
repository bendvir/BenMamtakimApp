/**
 * מיגרציה: מעלה את כל תמונות המוצרים ל-Cloudinary ומעדכן shop.json
 * הרץ פעם אחת: node backend/migrate-images-to-cloudinary.js
 */
require('dotenv').config({ path: __dirname + '/.env' });

const fs         = require('fs');
const path       = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SHOP_JSON   = path.join(__dirname, 'data', 'shop.json');
const PUBLIC_ROOT = path.join(__dirname, '..', 'public');

function resolveLocalPath(imageUrl) {
  if (!imageUrl) return null;
  const normalized = imageUrl.replace(/\\/g, '/');
  if (normalized.startsWith('uploads/')) {
    return path.join(PUBLIC_ROOT, 'assets', 'images', normalized);
  }
  if (normalized.startsWith('assets/')) {
    return path.join(PUBLIC_ROOT, normalized);
  }
  return null;
}

async function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: 'mamtakim', resource_type: 'image', use_filename: true, unique_filename: true },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    );
  });
}

async function migrate() {
  const shopData = JSON.parse(fs.readFileSync(SHOP_JSON, 'utf8'));
  let updated = 0;
  let skipped = 0;
  let failed  = 0;

  for (const product of shopData.products) {
    const url = product.image_url;

    if (url && url.startsWith('https://res.cloudinary.com')) {
      skipped++;
      continue;
    }

    const localPath = resolveLocalPath(url);
    if (!localPath || !fs.existsSync(localPath)) {
      console.log(`⚠️  קובץ לא נמצא: ${url}`);
      failed++;
      continue;
    }

    try {
      process.stdout.write(`⬆️  מעלה: ${path.basename(localPath)} ... `);
      const cloudUrl = await uploadToCloudinary(localPath);
      product.image_url = cloudUrl;
      updated++;
      console.log('✅');
    } catch (err) {
      console.log(`❌ שגיאה: ${err.message}`);
      failed++;
    }
  }

  fs.writeFileSync(SHOP_JSON, JSON.stringify(shopData, null, 2), 'utf8');

  console.log('\n──────────────────────────');
  console.log(`✅ עודכנו:  ${updated}`);
  console.log(`⏭️  דולגו:   ${skipped}`);
  console.log(`❌ נכשלו:   ${failed}`);
  console.log('shop.json נשמר!');
}

migrate().catch(console.error);
