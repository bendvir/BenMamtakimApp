const express = require('express');
const jwt     = require('jsonwebtoken');
const db      = require('../database');
const auth    = require('../middleware/auth');
const router  = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'סיסמה שגויה' });
  }
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );
  res.json({ token });
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
