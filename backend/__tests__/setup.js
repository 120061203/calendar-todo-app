// 測試環境設置
process.env.NODE_ENV = 'test';

// 設置測試超時時間
jest.setTimeout(10000);

// 全局測試工具函數
global.createTestEvent = (overrides = {}) => ({
  title: '測試事件',
  start_time: '2024-01-20T10:00:00.000Z',
  end_time: '2024-01-20T11:00:00.000Z',
  ...overrides
});

global.createTestTodo = (overrides = {}) => ({
  title: '測試待辦事項',
  due_date: '2024-01-20',
  completed: false,
  ...overrides
});

// 清理函數
afterEach(() => {
  jest.clearAllMocks();
});
