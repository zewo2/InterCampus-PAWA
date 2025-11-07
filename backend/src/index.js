const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const viewRoutes = require('./routes/views');
const errorHandler = require('./middlewares/errorHandler');
const { testConnection } = require('./database/db');

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// API routes
app.use('/api', routes);

// View routes (dummy/placeholder pages)
app.use('/', viewRoutes);

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