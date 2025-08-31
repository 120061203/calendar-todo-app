// backend/middleware/index.js
const { securityHeaders, rateLimiter, sanitizeInput, requestLogger } = require('./security');

module.exports = {
  securityHeaders,
  rateLimiter,
  sanitizeInput,
  requestLogger
};
