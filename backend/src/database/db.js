const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

module.exports = { pool, testConnection };