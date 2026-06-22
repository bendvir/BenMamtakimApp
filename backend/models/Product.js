const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id:           { type: Number, required: true, unique: true },
  title:        { type: String, required: true },
  price:        { type: Number, required: true },
  price_type:   { type: Number, default: 0 },
  category_id:  { type: String, required: true },
  image_url:    { type: String, default: '' },
  description:  { type: String, default: '' },
  in_stock:     { type: Number, default: 1 },
  is_new:       { type: Number, default: 0 },
  is_new_until: { type: Date,   default: null },
  created_at:   { type: String },
  updated_at:   { type: String },
});

module.exports = mongoose.model('Product', productSchema);
