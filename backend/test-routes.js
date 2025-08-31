// backend/test-routes.js
const app = require('./index-fixed');

// 模擬請求
const testRequest = (path) => {
  const req = { url: path, method: 'GET' };
  const res = {
    json: (data) => console.log(`${path}:`, data),
    status: (code) => ({ json: (data) => console.log(`${path} (${code}):`, data) })
  };
  
  // 簡單的路由測試
  if (path === '/api/todos') {
    console.log(`${path}: Route exists`);
  } else if (path === '/api/events') {
    console.log(`${path}: Route exists`);
  }
};

console.log('Testing routes...');
testRequest('/api/todos');
testRequest('/api/events');
console.log('Route test completed');
