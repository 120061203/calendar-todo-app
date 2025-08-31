const { Pool } = require('pg');
const config = require('./index');

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: config.database.max,
  idleTimeoutMillis: config.database.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.connectionTimeoutMillis,
  ssl: config.server.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
});

// 連接池事件監聽
pool.on('connect', (client) => {
  console.log('🔄 新的資料庫連接建立');
});

pool.on('error', (err, client) => {
  console.error('❌ 資料庫連接池錯誤:', err);
  // 在生產環境中，可能需要發送警報
  if (config.server.nodeEnv === 'production') {
    // 這裡可以集成監控系統
    console.error('🚨 生產環境資料庫錯誤，需要立即處理');
  }
});

pool.on('remove', (client) => {
  console.log('🔌 資料庫連接已移除');
});

// 健康檢查
const healthCheck = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ 資料庫健康檢查失敗:', error);
    return false;
  }
};

// 優雅關閉
const closePool = async () => {
  console.log('🔄 正在關閉資料庫連接池...');
  await pool.end();
  console.log('✅ 資料庫連接池已關閉');
};

module.exports = {
  pool,
  healthCheck,
  closePool
};
