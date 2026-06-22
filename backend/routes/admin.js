const express    = require('express');
const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const path       = require('path');
const multer     = require('multer');
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
    const { title, price, priceType, categoryId, imageUrl, description, inStock, isNew } = req.body;
    if (!title?.trim() || price == null || !categoryId)
      return res.status(400).json({ error: 'שדות חובה: title, price, categoryId' });
    const id = await db.createProduct({
      title: title.trim(), price: Number(price),
      price_type: priceType === 1 ? 1 : 0, category_id: categoryId,
      image_url: imageUrl || '', description: description || '',
      in_stock: inStock === false ? 0 : 1, is_new: isNew ? 1 : 0,
    });
    res.status(201).json({ id, message: 'מוצר נוסף בהצלחה' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/products/:id — update
router.put('/products/:id', async (req, res) => {
  try {
    const { title, price, priceType, categoryId, imageUrl, description, inStock, isNew } = req.body;
    const ok = await db.updateProduct(req.params.id, {
      title: title?.trim(), price: Number(price),
      price_type: priceType === 1 ? 1 : 0, category_id: categoryId,
      image_url: imageUrl || '', description: description || '',
      in_stock: inStock === false ? 0 : 1, is_new: isNew ? 1 : 0,
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

module.exports = router;
