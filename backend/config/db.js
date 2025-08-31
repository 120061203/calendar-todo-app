// backend/config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 5,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 60000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000
});

module.exports = pool;
