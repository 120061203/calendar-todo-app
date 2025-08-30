const logger = require('../../middleware/logger');

// Mock console.log
const originalConsoleLog = console.log;
let consoleOutput = [];

describe('Logger Middleware', () => {
  beforeEach(() => {
    consoleOutput = [];
    console.log = jest.fn((...args) => {
      consoleOutput.push(args.join(' '));
    });
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  test('應該記錄 GET 請求', () => {
    const req = {
      method: 'GET',
      path: '/api/todos'
    };
    const res = {
      statusCode: 200,
      send: jest.fn()
    };
    const next = jest.fn();

    logger(req, res, next);

    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('GET /api/todos');
    expect(next).toHaveBeenCalled();
  });

  test('應該記錄 POST 請求的請求體', () => {
    const req = {
      method: 'POST',
      path: '/api/todos',
      body: { title: '測試待辦事項', due_date: '2024-01-20' }
    };
    const res = {
      statusCode: 200,
      send: jest.fn()
    };
    const next = jest.fn();

    logger(req, res, next);

    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('POST /api/todos');
    expect(consoleOutput[1]).toContain('Request Body:');
    expect(consoleOutput[1]).toContain('測試待辦事項');
    expect(next).toHaveBeenCalled();
  });

  test('應該記錄成功的 POST 響應', () => {
    const req = {
      method: 'POST',
      path: '/api/todos'
    };
    const res = {
      statusCode: 200,
      send: jest.fn()
    };
    const next = jest.fn();

    logger(req, res, next);

    // 模擬發送響應
    const responseData = { id: 1, title: '新待辦事項' };
    res.send(JSON.stringify(responseData));

    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('POST /api/todos');
    expect(consoleOutput[2]).toContain('Response Status: 200');
    expect(consoleOutput[3]).toContain('Response Data:');
    expect(consoleOutput[3]).toContain('新待辦事項');
    expect(next).toHaveBeenCalled();
  });

  test('應該記錄非 200 狀態的響應', () => {
    const req = {
      method: 'POST',
      path: '/api/todos'
    };
    const res = {
      statusCode: 400,
      send: jest.fn()
    };
    const next = jest.fn();

    logger(req, res, next);

    // 模擬發送響應
    const responseData = { error: 'Bad Request' };
    res.send(JSON.stringify(responseData));

    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('POST /api/todos');
    expect(consoleOutput[2]).toContain('Response Status: 400');
    // 非 200 狀態不應該記錄響應數據
    expect(consoleOutput[3]).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test('應該記錄非 POST 請求的響應狀態', () => {
    const req = {
      method: 'GET',
      path: '/api/todos'
    };
    const res = {
      statusCode: 200,
      send: jest.fn()
    };
    const next = jest.fn();

    logger(req, res, next);

    // 模擬發送響應
    const responseData = { todos: [] };
    res.send(JSON.stringify(responseData));

    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('GET /api/todos');
    expect(consoleOutput[1]).toContain('Response Status: 200');
    // GET 請求不應該記錄響應數據
    expect(consoleOutput[2]).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test('應該處理無效的 JSON 響應', () => {
    const req = {
      method: 'POST',
      path: '/api/todos'
    };
    const res = {
      statusCode: 200,
      send: jest.fn()
    };
    const next = jest.fn();

    logger(req, res, next);

    // 模擬發送無效 JSON
    res.send('Invalid JSON');

    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0]).toContain('POST /api/todos');
    expect(consoleOutput[2]).toContain('Response Status: 200');
    // 無效 JSON 不應該記錄響應數據
    expect(consoleOutput[3]).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  test('應該調用 next() 函數', () => {
    const req = {
      method: 'GET',
      path: '/api/todos'
    };
    const res = {
      statusCode: 200,
      send: jest.fn()
    };
    const next = jest.fn();

    logger(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
