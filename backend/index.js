const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

// 中間件
const {
  securityHeaders,
  rateLimiter,
  sanitizeInput,
  requestLogger
} = require('./middleware');

// 路由
const todoRoutes = require('./routes/todos');
const eventRoutes = require('./routes/events');
const healthRoutes = require('./routes/health');

const app = express();

// 信任代理設置（修復 Vercel 部署問題）
app.set('trust proxy', 1);

// 安全中間件
app.use(securityHeaders);
app.use(rateLimiter);

// 基礎中間件
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('combined', { stream: { write: message => console.log(message.trim()) } }));

const requestSizeLimit = { limit: '10mb' };
app.use(express.json(requestSizeLimit));
app.use(express.urlencoded(requestSizeLimit));
app.use(sanitizeInput);
app.use(requestLogger);

// 健康檢查端點
app.use('/api/health', healthRoutes);

// 測試路由
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// API 路由
app.use('/api/todos', todoRoutes);
app.use('/api/events', eventRoutes);

// 根路徑
app.get('/', (req, res) => {
  res.json({
    message: 'Calendar Todo API',
    version: '2.0.0',
    status: 'running',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// 錯誤處理中間件（必須放在最後）
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message || 'Something went wrong'
  });
});

// 啟動服務器
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3000} (v2.1-repeat-events-fixed)`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
