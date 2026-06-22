const express    = require('express');
const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const path       = require('path');
const multer     = require('multer');
const XLSX       = require('xlsx');
const cloudinary = require('cloudinary').v2;
const db         = require('../database');
const auth       = require('../middleware/auth');
const mailer     = require('../mailer');
const router     = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('קבצי תמונה בלבד'));
  },
});

const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// In-memory OTP store: sessionId → { code, expiresAt }
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Cleanup expired OTP entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore) {
    if (now > val.expiresAt) otpStore.delete(key);
  }
}, 5 * 60 * 1000);

// POST /api/admin/login — step 1: password → sends OTP to email
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'סיסמה שגויה' });
  }

  const code      = generateOTP();
  const sessionId = crypto.randomBytes(16).toString('hex');
  otpStore.set(sessionId, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

  try {
    await mailer.sendOTP(code);
    console.log(`[OTP] Sent to ${process.env.EMAIL_TO || process.env.EMAIL_USER}`);
  } catch (e) {
    console.error('[OTP] Email failed:', e.message);
    // Fallback: log code to console so dev can still login
    console.log('[OTP] DEV FALLBACK — code:', code);
  }

  res.json({ step: 'otp', sessionId });
});

// POST /api/admin/verify-otp — step 2: validate code → return JWT
router.post('/verify-otp', (req, res) => {
  const { sessionId, code } = req.body;
  if (!sessionId || !code) {
    return res.status(400).json({ error: 'נדרש sessionId וקוד' });
  }

  const entry = otpStore.get(sessionId);
  if (!entry) {
    return res.status(401).json({ error: 'הפעלה לא תקינה — נסה להתחבר מחדש' });
  }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(sessionId);
    return res.status(401).json({ error: 'הקוד פג תוקף — נסה שנית' });
  }
  if (entry.code !== code.trim()) {
    return res.status(401).json({ error: 'קוד שגוי' });
  }

  otpStore.delete(sessionId);
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );
  res.json({ token });
});

// POST /api/admin/upload — upload product image to Cloudinary (protected)
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'לא נבחר קובץ' });
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'mamtakim', resource_type: 'image' },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'שגיאה בהעלאת תמונה' });
  }
});

router.use(auth);

// GET /api/admin/categories
router.get('/categories', async (_req, res) => {
  try { res.json(await db.getCategories()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/products — includes out-of-stock
router.get('/products', async (_req, res) => {
  try {
    const [cats, products] = await Promise.all([
      db.getCategories(),
      db.getProducts({ includeOutOfStock: true }),
    ]);
    const catMap = Object.fromEntries(cats.map(c => [c.id, c.name_he]));
    res.json(products.map(p => ({ ...p, category_name: catMap[p.category_id] ?? p.category_id })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/products — create
router.post('/products', async (req, res) => {
  try {
    const { title, price, priceType, categoryId, imageUrl, description, inStock, isNew, promoQty, promoPrice } = req.body;
    if (!title?.trim() || price == null || !categoryId)
      return res.status(400).json({ error: 'שדות חובה: title, price, categoryId' });
    const id = await db.createProduct({
      title: title.trim(), price: Number(price),
      price_type: priceType === 1 ? 1 : 0, category_id: categoryId,
      image_url: imageUrl || '', description: description || '',
      in_stock: inStock === false ? 0 : 1, is_new: isNew ? 1 : 0,
      promo_qty: Number(promoQty) || 0, promo_price: Number(promoPrice) || 0,
    });
    res.status(201).json({ id, message: 'מוצר נוסף בהצלחה' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/products/:id — update
router.put('/products/:id', async (req, res) => {
  try {
    const { title, price, priceType, categoryId, imageUrl, description, inStock, isNew, promoQty, promoPrice } = req.body;
    const ok = await db.updateProduct(req.params.id, {
      title: title?.trim(), price: Number(price),
      price_type: priceType === 1 ? 1 : 0, category_id: categoryId,
      image_url: imageUrl || '', description: description || '',
      in_stock: inStock === false ? 0 : 1, is_new: isNew ? 1 : 0,
      promo_qty: Number(promoQty) || 0, promo_price: Number(promoPrice) || 0,
    });
    if (!ok) return res.status(404).json({ error: 'מוצר לא נמצא' });
    res.json({ message: 'מוצר עודכן בהצלחה' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const ok = await db.deleteProduct(req.params.id);
    if (!ok) return res.status(404).json({ error: 'מוצר לא נמצא' });
    res.json({ message: 'מוצר נמחק' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/admin/products/:id/image — עדכון תמונה בלבד
router.patch('/products/:id/image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'חסר imageUrl' });
    const Product = require('../models/Product');
    const result = await Product.updateOne(
      { id: Number(req.params.id) },
      { $set: { image_url: imageUrl, updated_at: new Date().toISOString() } }
    );
    if (!result.matchedCount) return res.status(404).json({ error: 'מוצר לא נמצא' });
    res.json({ message: 'תמונה עודכנה' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/search-image?q=שם+מוצר+או+ברקוד
router.get('/search-image', async (req, res) => {
  const q = req.query.q?.toString().trim();
  if (!q) return res.status(400).json({ error: 'חסר פרמטר q' });

  const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, */*',
  };

  // 1. Open Food Facts
  try {
    const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=30&fields=product_name,brands,image_front_url,image_front_small_url,image_url`;
    const offResp = await fetch(offUrl, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
    if (offResp.ok) {
      const data = await offResp.json();
      const results = (data.products || [])
        .filter(p => p.image_front_url || p.image_url)
        .slice(0, 9)
        .map(p => ({
          name:     p.product_name || '',
          brand:    p.brands       || '',
          imageUrl: p.image_front_url || p.image_url,
          thumbUrl: p.image_front_small_url || p.image_front_url || p.image_url,
        }));
      if (results.length > 0) return res.json(results);
    }
  } catch (_) {}

  // 2. UPC Item DB (fallback — אפקטיבי למוצרים בינלאומיים)
  try {
    const upcUrl = `https://api.upcitemdb.com/prod/trial/search?s=${encodeURIComponent(q)}&type=product`;
    const upcResp = await fetch(upcUrl, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
    if (upcResp.ok) {
      const data = await upcResp.json();
      const results = (data.items || [])
        .filter(item => item.images?.length > 0)
        .slice(0, 9)
        .map(item => ({
          name:     item.title || '',
          brand:    item.brand || '',
          imageUrl: item.images[0],
          thumbUrl: item.images[0],
        }));
      if (results.length > 0) return res.json(results);
    }
  } catch (_) {}

  res.json([]);
});

// POST /api/admin/import-excel — ייבוא מוצרים מקובץ Excel
router.post('/import-excel', auth, uploadExcel.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'לא נבחר קובץ' });

  const Category = require('../models/Category');
  const allCats  = await Category.find().lean();
  const validCats   = new Set(allCats.map(c => c.id));
  const hebrewToCat = Object.fromEntries(allCats.map(c => [c.name_he.trim(), c.id]));

  let workbook;
  try {
    workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  } catch {
    return res.status(400).json({ error: 'קובץ Excel לא תקין' });
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows  = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const results = { added: 0, updated: 0, skipped: [], errors: [] };

  // טוען את כל המוצרים פעם אחת ובונה מפה לפי שם מנורמל
  const Product = require('../models/Product');
  const allProducts = await Product.find({}).lean();
  const normalize   = s => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const productMap  = new Map(allProducts.map(p => [normalize(p.title), p]));

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    const title      = String(row['שם מוצר'] || row['title'] || '').trim();
    const price      = parseFloat(row['מחיר'] || row['price']);
    const priceType  = parseInt(row['סוג תמחור'] ?? row['price_type'] ?? 1);
    const catRaw     = String(row['קטגוריה'] || row['category_id'] || '').trim();
    const categoryId = hebrewToCat[catRaw] ?? catRaw;
    const imageUrl   = String(row['URL תמונה'] || row['image_url'] || '').trim();
    const description= String(row['תיאור']    || row['description'] || '').trim();
    const inStock    = parseInt(row['במלאי']     ?? row['in_stock']    ?? 1);
    const isNew      = parseInt(row['מוצר חדש']  ?? row['is_new']     ?? 0);
    const promoQty   = parseFloat(row['כמות מבצע'] ?? row['promo_qty']   ?? 0) || 0;
    const promoPrice = parseFloat(row['מחיר מבצע'] ?? row['promo_price'] ?? 0) || 0;

    if (!title) { results.skipped.push(`שורה ${rowNum}: שם ריק`); continue; }
    if (isNaN(price) || price < 0) { results.errors.push(`שורה ${rowNum} (${title}): מחיר לא תקין`); continue; }
    if (!validCats.has(categoryId)) { results.errors.push(`שורה ${rowNum} (${title}): קטגוריה "${categoryId}" לא קיימת`); continue; }

    const existing = productMap.get(normalize(title));

    try {
      if (existing) {
        await db.updateProduct(existing.id, {
          price,
          price_type:  [0,1].includes(priceType) ? priceType : 1,
          category_id: categoryId,
          image_url:   imageUrl || existing.image_url,
          description: description || existing.description,
          in_stock:    inStock ? 1 : 0,
          is_new:      isNew ? 1 : 0,
          promo_qty:   promoQty,
          promo_price: promoPrice,
        });
        results.updated++;
      } else {
        await db.createProduct({
          title, price,
          price_type:  [0,1].includes(priceType) ? priceType : 1,
          category_id: categoryId,
          image_url:   imageUrl,
          description, in_stock: inStock ? 1 : 0, is_new: isNew ? 1 : 0,
          promo_qty: promoQty, promo_price: promoPrice,
        });
        productMap.set(normalize(title), { title }); // מונע כפול בתוך אותו קובץ
        results.added++;
      }
    } catch (err) {
      results.errors.push(`שורה ${rowNum} (${title}): ${err.message}`);
    }
  }

  res.json(results);
});

module.exports = router;
