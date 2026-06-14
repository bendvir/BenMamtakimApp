require('dotenv').config();
require('./database'); // initialize DB + seed on startup

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:4200', 'http://localhost:4300'];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-server SSR)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
}));
app.use(express.json());

const uploadsPath = require('path').join(__dirname, '..', 'public', 'assets', 'images', 'uploads');
app.use('/uploads', require('express').static(uploadsPath));

app.use('/api/products', require('./routes/products'));
app.use('/api/admin',   require('./routes/admin'));

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
);

app.listen(PORT, () =>
  console.log(`🟢  ממתקי התקווה backend  →  http://localhost:${PORT}`)
);
