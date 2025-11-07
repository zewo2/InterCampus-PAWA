const express = require('express');
require('dotenv').config();
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { testConnection } = require('./database/db');

const app = express();
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Try a DB connection if available (non-fatal)
    await testConnection();
    console.log('Database connection OK');
  } catch (err) {
    console.warn('Database connection failed (continuing):', err.message || err);
  }

  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
}

start();