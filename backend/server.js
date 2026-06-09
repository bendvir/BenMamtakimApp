require('dotenv').config();
require('./database'); // initialize DB + seed on startup

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:4200', 'http://localhost:4300'] }));
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/admin',   require('./routes/admin'));

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', time: new Date().toISOString() })
);

app.listen(PORT, () =>
  console.log(`🟢  ממתקי התקווה backend  →  http://localhost:${PORT}`)
);
