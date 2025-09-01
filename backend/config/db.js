// backend/config/db.js
const { Pool } = require("pg");

// 根據環境決定是否使用 SSL
const isLocalDatabase = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';
const sslConfig = isLocalDatabase ? false : { rejectUnauthorized: false };

console.log('Database config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  ssl: sslConfig,
  isLocal: isLocalDatabase
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: sslConfig,
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 5,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 60000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000
});

module.exports = pool;
