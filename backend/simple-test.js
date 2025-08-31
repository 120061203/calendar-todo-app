// backend/simple-test.js
const express = require('express');

const app = express();

// 測試路由
app.get('/test', (req, res) => {
  res.json({ message: 'Simple test route working' });
});

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Simple test app working' });
});

module.exports = app;
