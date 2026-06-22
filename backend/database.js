const Product  = require('./models/Product');
const Category = require('./models/Category');
const Counter  = require('./models/Counter');

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

async function nextId() {
  const counter = await Counter.findByIdAndUpdate(
    'productId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

const db = {
  async getCategories() {
    return Category.find().sort({ sort_order: 1 }).lean();
  },

  async getProducts({ includeOutOfStock = false } = {}) {
    // Lazy auto-reset is_new after 12 hours
    await Product.updateMany(
      { is_new: 1, is_new_until: { $lt: new Date() } },
      { $set: { is_new: 0, is_new_until: null } }
    );
    const query = includeOutOfStock ? {} : { in_stock: 1 };
    return Product.find(query).lean();
  },

  async getProductsByCategory(categoryId, opts = {}) {
    const all = await this.getProducts(opts);
    return all.filter(p => p.category_id === categoryId);
  },

  async createProduct({ title, price, price_type, category_id, image_url, description, in_stock, is_new = 0 }) {
    const id  = await nextId();
    const now = new Date().toISOString();
    const is_new_until = is_new ? new Date(Date.now() + TWELVE_HOURS) : null;
    await Product.create({ id, title, price, price_type, category_id, image_url, description, in_stock, is_new, is_new_until, created_at: now, updated_at: now });
    return id;
  },

  async updateProduct(id, fields) {
    const product = await Product.findOne({ id: Number(id) });
    if (!product) return false;
    let is_new_until = product.is_new_until;
    if ('is_new' in fields) {
      is_new_until = fields.is_new ? new Date(Date.now() + TWELVE_HOURS) : null;
    }
    await Product.updateOne({ id: Number(id) }, { ...fields, is_new_until, updated_at: new Date().toISOString() });
    return true;
  },

  async deleteProduct(id) {
    const result = await Product.deleteOne({ id: Number(id) });
    return result.deletedCount > 0;
  },
};

module.exports = db;
