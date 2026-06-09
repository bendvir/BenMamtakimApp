const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE  = path.join(DATA_DIR, 'shop.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── DEFAULTS ────────────────────────────────────────────────────────────────
const DEFAULT_DB = {
  _nextId: 1000,
  categories: [
    { id: 'dried-fruits', name_he: 'פירות יבשים',       sort_order: 1 },
    { id: 'natural-nuts', name_he: 'אגוזים טבעיים',     sort_order: 2 },
    { id: 'roasted',      name_he: 'פיצוחים קלויים',    sort_order: 3 },
    { id: 'chocolates',   name_he: 'שוקולדים וממתקים',  sort_order: 4 },
    { id: 'food',         name_he: 'מוצרי מזון',         sort_order: 5 },
    { id: 'spirits',      name_he: 'שתייה חריפה',       sort_order: 6 },
    { id: 'soft-drinks',  name_he: 'שתייה קלה',         sort_order: 7 },
  ],
  products: [
    // ── פירות יבשים ──
    { id:1, title:'צימוקים',          price:50,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/raisins.jpg',        description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:2, title:'משמש מיובש',       price:75,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/dried-apricots.jpg', description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:3, title:'שזיפים מיובשים',   price:65,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/prunes.jpg',          description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:4, title:'תאנים מיובשות',    price:80,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/dried-figs.jpg',      description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:5, title:'קרנברי',           price:85,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/cranberries.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:6, title:'מנגו מיובש',       price:90,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/mango.jpg',           description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:7, title:"בננה צ'יפס",       price:55,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/banana-chips.jpg',    description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:8, title:'פפאיה מיובשת',     price:70,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/papaya.jpg',          description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:9, title:'אננס מיובש',       price:75,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/pineapple.jpg',       description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:10,title:'גרגרי חמוציות',    price:88,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/berries.jpg',         description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:11,title:'תמרים',            price:70,  price_type:0, category_id:'dried-fruits', image_url:'assets/images/fruits/dates.jpg',           description:'', in_stock:1, is_new:0, is_new_until:null },
    // ── אגוזים טבעיים ──
    { id:12,title:'שקדים',            price:90,  price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/almonds.jpg',         description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:13,title:'אגוזי מלך',        price:100, price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/walnuts.jpg',         description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:14,title:'אגוזי קשיו',       price:120, price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/cashews.jpg',         description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:15,title:'פיסטוקים',         price:130, price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/pistachios.jpg',      description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:16,title:'אגוזי ברזיל',      price:110, price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/brazil-nuts.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:17,title:'אגוזי לוז',        price:95,  price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/hazelnuts.jpg',       description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:18,title:'פקאן',             price:140, price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/pecan.jpg',           description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:19,title:'מקדמיה',           price:150, price_type:0, category_id:'natural-nuts', image_url:'assets/images/fruits/macadamia.jpg',       description:'', in_stock:1, is_new:0, is_new_until:null },
    // ── פיצוחים קלויים ──
    { id:20,title:'שקדים קלויים',     price:100, price_type:0, category_id:'roasted', image_url:'assets/images/fruits/almonds.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:21,title:'אגוזי קשיו קלויים',price:130, price_type:0, category_id:'roasted', image_url:'assets/images/fruits/cashews.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:22,title:'פיסטוקים קלויים',  price:140, price_type:0, category_id:'roasted', image_url:'assets/images/fruits/pistachios.jpg',  description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:23,title:'בוטנים קלויים',    price:40,  price_type:0, category_id:'roasted', image_url:'assets/images/fruits/almonds.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:24,title:'גרעיני חמניה',     price:45,  price_type:0, category_id:'roasted', image_url:'assets/images/fruits/almonds.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:25,title:'אגוזי לוז קלויים', price:105, price_type:0, category_id:'roasted', image_url:'assets/images/fruits/hazelnuts.jpg',  description:'', in_stock:1, is_new:0, is_new_until:null },
    // ── שוקולדים וממתקים ──
    { id:26,title:'שוקולד בלגי',      price:80,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/chocolate.jpg',   description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:27,title:'סוכריות מיקס',     price:60,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/candy-mix.jpg',   description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:28,title:'מרשמלו',           price:50,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/marshmallow.jpg', description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:29,title:'גומי דובים',       price:55,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/gummy-bears.jpg', description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:30,title:'טופי',             price:70,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/toffee.jpg',      description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:31,title:'פרלינים',          price:120, price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/pralines.jpg',    description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:32,title:'דראגי שוקולד',     price:90,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/dragee.jpg',      description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:33,title:'חלבה שוקולד',      price:65,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/halva.jpg',       description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:34,title:'נוגט',             price:75,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/nougat.jpg',      description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:35,title:'בונבונים',         price:50,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/bonbons.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:36,title:'קרמל',             price:60,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/caramel.jpg',     description:'', in_stock:1, is_new:0, is_new_until:null },
    { id:37,title:'לוקום',            price:55,  price_type:0, category_id:'chocolates', image_url:'assets/images/sweets/lokum.jpg',       description:'', in_stock:1, is_new:0, is_new_until:null },
  ],
};

// ── READ / WRITE ─────────────────────────────────────────────────────────────
function read() {
  if (!fs.existsSync(DB_FILE)) {
    write(DEFAULT_DB);
    console.log('✅ shop.json initialized with seed data');
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function write(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

// ── API ──────────────────────────────────────────────────────────────────────
const db = {
  getCategories() {
    return read().categories.sort((a, b) => a.sort_order - b.sort_order);
  },

  getProducts({ includeOutOfStock = false } = {}) {
    const data = read();
    const now  = Date.now();
    let dirty  = false;

    // Lazy auto-reset is_new after 12 hours
    data.products.forEach(p => {
      if (p.is_new && p.is_new_until && new Date(p.is_new_until).getTime() < now) {
        p.is_new      = 0;
        p.is_new_until = null;
        dirty = true;
      }
    });

    if (dirty) write(data);

    return includeOutOfStock
      ? data.products
      : data.products.filter(p => p.in_stock === 1);
  },

  getProductsByCategory(categoryId, { includeOutOfStock = false } = {}) {
    return this.getProducts({ includeOutOfStock })
      .filter(p => p.category_id === categoryId);
  },

  createProduct({ title, price, price_type, category_id, image_url, description, in_stock, is_new = 0 }) {
    const data = read();
    const id   = ++data._nextId;
    const now  = new Date().toISOString();
    const is_new_until = is_new
      ? new Date(Date.now() + TWELVE_HOURS).toISOString()
      : null;
    const product = { id, title, price, price_type, category_id, image_url, description, in_stock, is_new, is_new_until, created_at: now, updated_at: now };
    data.products.push(product);
    write(data);
    return id;
  },

  updateProduct(id, fields) {
    const data = read();
    const idx  = data.products.findIndex(p => p.id === Number(id));
    if (idx === -1) return false;

    // Recalculate is_new_until when is_new flag changes
    let is_new_until = data.products[idx].is_new_until;
    if ('is_new' in fields) {
      is_new_until = fields.is_new
        ? new Date(Date.now() + TWELVE_HOURS).toISOString()
        : null;
    }

    data.products[idx] = { ...data.products[idx], ...fields, is_new_until, updated_at: new Date().toISOString() };
    write(data);
    return true;
  },

  deleteProduct(id) {
    const data   = read();
    const before = data.products.length;
    data.products = data.products.filter(p => p.id !== Number(id));
    if (data.products.length === before) return false;
    write(data);
    return true;
  },
};

module.exports = db;
