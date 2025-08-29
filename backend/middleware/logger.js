const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  if (req.method === 'POST') {
    console.log('  Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  // 記錄響應狀態
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`  Response Status: ${res.statusCode}`);
    if (res.statusCode === 200 && req.method === 'POST') {
      console.log('  Response Data:', JSON.stringify(JSON.parse(data), null, 2));
    }
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = logger;
