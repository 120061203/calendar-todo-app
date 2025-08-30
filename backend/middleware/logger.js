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
      try {
        const parsedData = JSON.parse(data);
        console.log('  Response Data:', JSON.stringify(parsedData, null, 2));
      } catch (error) {
        // 如果不是有效的 JSON，跳過記錄
      }
    }
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = logger;
