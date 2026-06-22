const express = require('express');
const db      = require('../database');
const router  = express.Router();

// GET /api/products
router.get('/', async (_req, res) => {
  try {
    const [categories, products] = await Promise.all([
      db.getCategories(),
      db.getProducts({ includeOutOfStock: true }),
    ]);
    res.json(categories.map(cat => ({
      ...cat,
      products: products.filter(p => p.category_id === cat.id).map(mapProduct),
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:categoryId
router.get('/:categoryId', async (req, res) => {
  try {
    const [cats, products] = await Promise.all([
      db.getCategories(),
      db.getProductsByCategory(req.params.categoryId, { includeOutOfStock: true }),
    ]);
    const cat = cats.find(c => c.id === req.params.categoryId);
    if (!cat) return res.status(404).json({ error: 'קטגוריה לא נמצאה' });
    res.json({ ...cat, products: products.map(mapProduct) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function mapProduct(p) {
  return {
    id:          p.id,
    title:       p.title,
    price:       p.price,
    priceType:   p.price_type,
    category:    p.category_id,
    link:        p.image_url   || '',
    description: p.description || '',
    inStock:     p.in_stock === 1,
    isNew:       p.is_new === 1,
    updatedAt:   p.updated_at,
  };
}

module.exports = router;
