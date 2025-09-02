// backend/config/db.js
const { Pool } = require("pg");

let pool;

// 優先使用 DATABASE_URL (Vercel/Supabase)
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for connection');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000
  });
} else {
  // 回退到個別環境變量 (本地開發)
  const isLocalDatabase = process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1';
  const sslConfig = isLocalDatabase ? false : { rejectUnauthorized: false };

  console.log('Using individual DB config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    ssl: sslConfig,
    isLocal: isLocalDatabase
  });

  pool = new Pool({
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
}

module.exports = pool;
