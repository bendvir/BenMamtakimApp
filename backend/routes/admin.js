const express = require('express');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const path    = require('path');
const multer  = require('multer');
const db      = require('../database');
const auth    = require('../middleware/auth');
const mailer  = require('../mailer');
const router  = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'public', 'assets', 'images', 'uploads'),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  },
});
const upload = multer({
  storage,
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

// POST /api/admin/upload — upload product image (protected)
router.post('/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'לא נבחר קובץ' });
  res.json({ imageUrl: `uploads/${req.file.filename}` });
});

router.use(auth);

// GET /api/admin/categories
router.get('/categories', (_req, res) => {
  res.json(db.getCategories());
});

// GET /api/admin/products — includes out-of-stock
router.get('/products', (_req, res) => {
  const cats    = db.getCategories();
  const catMap  = Object.fromEntries(cats.map(c => [c.id, c.name_he]));
  const products = db.getProducts({ includeOutOfStock: true }).map(p => ({
    ...p,
    category_name: catMap[p.category_id] ?? p.category_id,
  }));
  res.json(products);
});

// POST /api/admin/products — create
router.post('/products', (req, res) => {
  const { title, price, priceType, categoryId, imageUrl, description, inStock, isNew } = req.body;
  if (!title?.trim() || price == null || !categoryId) {
    return res.status(400).json({ error: 'שדות חובה: title, price, categoryId' });
  }
  const id = db.createProduct({
    title:       title.trim(),
    price:       Number(price),
    price_type:  priceType === 1 ? 1 : 0,
    category_id: categoryId,
    image_url:   imageUrl   || '',
    description: description || '',
    in_stock:    inStock === false ? 0 : 1,
    is_new:      isNew ? 1 : 0,
  });
  res.status(201).json({ id, message: 'מוצר נוסף בהצלחה' });
});

// PUT /api/admin/products/:id — update
router.put('/products/:id', (req, res) => {
  const { title, price, priceType, categoryId, imageUrl, description, inStock, isNew } = req.body;
  const ok = db.updateProduct(req.params.id, {
    title:       title?.trim(),
    price:       Number(price),
    price_type:  priceType === 1 ? 1 : 0,
    category_id: categoryId,
    image_url:   imageUrl   || '',
    description: description || '',
    in_stock:    inStock === false ? 0 : 1,
    is_new:      isNew ? 1 : 0,
  });
  if (!ok) return res.status(404).json({ error: 'מוצר לא נמצא' });
  res.json({ message: 'מוצר עודכן בהצלחה' });
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', (req, res) => {
  const ok = db.deleteProduct(req.params.id);
  if (!ok) return res.status(404).json({ error: 'מוצר לא נמצא' });
  res.json({ message: 'מוצר נמחק' });
});

module.exports = router;
