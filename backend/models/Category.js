const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id:         { type: String, required: true, unique: true },
  name_he:    { type: String, required: true },
  sort_order: { type: Number, default: 0 },
});

module.exports = mongoose.model('Category', categorySchema);
