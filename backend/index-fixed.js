// backend/index-fixed.js
const express = require('express');
const cors = require('cors');

const app = express();

// 基本中間件
app.use(cors());
app.use(express.json());

// 測試路由
app.get('/test', (req, res) => {
  res.json({ message: 'Fixed index.js test route working' });
});

// 健康檢查路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Health check working' });
});

// 嘗試載入路由模組
let todoRoutes, eventRoutes;
try {
  todoRoutes = require('./routes/todos');
  eventRoutes = require('./routes/events');
  console.log('Routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error);
}

// 如果路由載入成功，則使用它們
if (todoRoutes && eventRoutes) {
  app.use('/api/todos', todoRoutes);
  app.use('/api/events', eventRoutes);
  console.log('API routes mounted successfully');
}

// 測試資料庫連接
app.get('/api/health-db', async (req, res) => {
  try {
    const pool = require('./config/db');
    await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'Calendar Todo API - Fixed Version',
    version: '2.0.0-fixed',
    status: 'running',
    health: '/api/health',
    healthDb: '/api/health-db',
    routes: todoRoutes && eventRoutes ? 'loaded' : 'failed'
  });
});

module.exports = app;
