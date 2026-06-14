const express = require('express');
const db = require('../database');
const router = express.Router();

// GET /api/products — all categories with their in-stock products
router.get('/', (req, res) => {
  const categories = db.getCategories();
  const products   = db.getProducts({ includeOutOfStock: true });
  res.json(categories.map(cat => ({
    ...cat,
    products: products
      .filter(p => p.category_id === cat.id)
      .map(mapProduct),
  })));
});

// GET /api/products/:categoryId
router.get('/:categoryId', (req, res) => {
  const cats = db.getCategories();
  const cat  = cats.find(c => c.id === req.params.categoryId);
  if (!cat) return res.status(404).json({ error: 'קטגוריה לא נמצאה' });

  res.json({
    ...cat,
    products: db.getProductsByCategory(req.params.categoryId, { includeOutOfStock: true }).map(mapProduct),
  });
});

function mapProduct(p) {
  return {
    id:          p.id,
    title:       p.title,
    price:       p.price,
    priceType:   p.price_type,
    category:    p.category_id,
    link:        p.image_url  || '',
    description: p.description || '',
    inStock:     p.in_stock === 1,
    isNew:       p.is_new === 1,
    updatedAt:   p.updated_at,
  };
}

module.exports = router;
