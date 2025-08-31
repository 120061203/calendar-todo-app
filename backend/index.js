const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

// 配置和工具
const config = require('./config');
const logger = require('./config/logger');
const { pool, healthCheck, closePool } = require('./config/database');

// 中間件
const { 
  securityHeaders, 
  rateLimiter, 
  corsOptions, 
  requestSizeLimit,
  sanitizeInput,
  requestLogger 
} = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// 路由
const todoRoutes = require('./routes/todos');
const eventRoutes = require('./routes/events');

const app = express();

// 安全中間件
app.use(securityHeaders);
app.use(rateLimiter);

// 基礎中間件
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json(requestSizeLimit));
app.use(express.urlencoded(requestSizeLimit));
app.use(sanitizeInput);
app.use(requestLogger);

// 健康檢查端點
app.get('/health', async (req, res) => {
  try {
    const dbHealthy = await healthCheck();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(uptime)}s`,
      database: dbHealthy ? 'connected' : 'disconnected',
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
      },
      environment: config.server.nodeEnv
    };
    
    const statusCode = dbHealthy ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
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
    health: '/health'
  });
});

// 404 處理
app.use(notFoundHandler);

// 錯誤處理中間件（必須放在最後）
app.use(errorHandler);

// 優雅關閉處理
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // 關閉資料庫連接池
    await closePool();
    logger.info('Database connections closed');
    
    // 關閉服務器
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    
    // 強制關閉（如果 10 秒內沒有正常關閉）
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
    
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// 監聽進程信號
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 未處理的 Promise 拒絕
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 未處理的異常
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// 啟動服務器
const server = app.listen(config.server.port, () => {
  logger.info(`🚀 Backend running on http://localhost:${config.server.port}`);
  logger.info(`🌍 Environment: ${config.server.nodeEnv}`);
  logger.info(`📊 Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
});

module.exports = app;
