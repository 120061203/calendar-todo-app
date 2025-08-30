# 🧪 測試技術參考文檔

> 📖 **用途**: 技術參考、測試案例查詢、開發者快速查詢  
> 🎯 **目標讀者**: 有經驗的開發者、測試工程師、項目維護者

## 📋 概述

這個專案包含完整的前端和後端測試套件，使用 Jest 作為測試框架，React Testing Library 用於前端測試，Supertest 用於後端 API 測試。

## 🚀 快速開始

### 運行所有測試

```bash
# 在專案根目錄執行
./run-tests.sh
```

### 手動運行測試

#### 前端測試
```bash
cd frontend
npm install  # 安裝依賴
npm test     # 運行測試
```

#### 後端測試
```bash
cd backend
npm install  # 安裝依賴
npm test     # 運行測試
```

## 📁 測試結構

```
├── frontend/
│   ├── src/
│   │   ├── components/__tests__/
│   │   │   ├── TodoList.test.jsx      # 待辦事項組件測試
│   │   │   └── CalendarView.test.jsx  # 行事曆組件測試
│   │   └── __tests__/
│   │       └── api.test.js            # API 函數測試
│   ├── jest.config.js                 # Jest 配置
│   └── src/setupTests.js              # 測試設置
├── backend/
│   ├── __tests__/
│   │   ├── routes/
│   │   │   ├── todos.test.js          # 待辦事項路由測試
│   │   │   └── events.test.js         # 事件路由測試
│   │   ├── middleware/
│   │   │   └── logger.test.js         # 日誌中間件測試
│   │   └── setup.js                   # 後端測試設置
│   └── jest.config.js                 # Jest 配置
└── run-tests.sh                       # 測試運行腳本
```

## 🎯 測試覆蓋範圍

### 前端測試

#### TodoList 組件
- ✅ **渲染測試**: 標題、輸入框、待辦事項列表
- ✅ **新增功能**: 新增待辦事項、帶日期的新增
- ✅ **完成狀態**: 標記完成/未完成
- ✅ **刪除功能**: 單個刪除、批量清除已完成
- ✅ **視覺狀態**: 完成/未完成的樣式
- ✅ **錯誤處理**: API 錯誤、驗證錯誤
- ✅ **載入狀態**: 載入指示器、按鈕禁用

#### CalendarView 組件
- ✅ **渲染測試**: 標題、按鈕、行事曆組件
- ✅ **新增事件**: 打開對話框、表單驗證
- ✅ **快速設定時長**: 30分鐘、1小時、2小時、半天
- ✅ **現在按鈕**: 開始時間和結束時間的現在按鈕
- ✅ **編輯事件**: 點擊事件、更新事件
- ✅ **刪除事件**: 刪除確認
- ✅ **時間驗證**: 結束時間必須晚於開始時間
- ✅ **錯誤處理**: API 錯誤、驗證錯誤
- ✅ **載入狀態**: 載入指示器、按鈕禁用

#### API 函數
- ✅ **待辦事項 API**: GET、POST、PUT、DELETE
- ✅ **事件 API**: GET、POST、PUT、DELETE
- ✅ **錯誤處理**: 網路錯誤、HTTP 錯誤
- ✅ **數據處理**: 複雜數據結構
- ✅ **URL 配置**: 正確的 API 端點

### 後端測試

#### 待辦事項路由
- ✅ **GET /api/todos**: 獲取所有待辦事項
- ✅ **POST /api/todos**: 創建新待辦事項
- ✅ **PUT /api/todos/:id**: 更新待辦事項
- ✅ **DELETE /api/todos/:id**: 刪除待辦事項
- ✅ **驗證**: 必填欄位檢查
- ✅ **錯誤處理**: 資料庫錯誤、404 錯誤

#### 事件路由
- ✅ **GET /api/events**: 獲取所有事件
- ✅ **POST /api/events**: 創建新事件
- ✅ **PUT /api/events/:id**: 更新事件
- ✅ **DELETE /api/events/:id**: 刪除事件
- ✅ **驗證**: 必填欄位檢查
- ✅ **錯誤處理**: 資料庫錯誤、404 錯誤

#### 中間件
- ✅ **Logger 中間件**: 請求記錄、響應記錄
- ✅ **請求記錄**: 方法、路徑、請求體
- ✅ **響應記錄**: 狀態碼、響應數據
- ✅ **錯誤處理**: 無效 JSON、異常情況

## 🛠️ 測試命令

### 基本測試
```bash
npm test                    # 運行所有測試
npm test -- --watch        # 監視模式
npm test -- --coverage     # 生成覆蓋率報告
npm test -- --verbose      # 詳細輸出
```

### 特定測試
```bash
npm test -- --testNamePattern="TodoList"  # 運行特定測試
npm test -- --testPathPattern="api"       # 運行特定路徑的測試
```

### 覆蓋率報告
```bash
npm test -- --coverage --coverageReporters=html
```

## 📊 測試覆蓋率

測試覆蓋率報告會生成在以下目錄：
- **前端**: `frontend/coverage/`
- **後端**: `backend/coverage/`

覆蓋率包括：
- **語句覆蓋率**: 執行的程式碼行數
- **分支覆蓋率**: 執行的條件分支
- **函數覆蓋率**: 執行的函數
- **行覆蓋率**: 執行的程式碼行

## 🔧 測試配置

### 前端 Jest 配置
```javascript
// frontend/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',           // DOM 環境
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {                // 路徑映射
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [              // 覆蓋率收集範圍
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
  ],
  testTimeout: 10000,                 // 測試超時時間
};
```

### 後端 Jest 配置
```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',            // Node.js 環境
  testMatch: [                        // 測試文件匹配
    '<rootDir>/__tests__/**/*.test.js',
  ],
  collectCoverageFrom: [              // 覆蓋率收集範圍
    'routes/**/*.js',
    'middleware/**/*.js',
  ],
  testTimeout: 10000,                 // 測試超時時間
};
```

## 🧹 測試清理

### 清理測試文件
```bash
# 清理覆蓋率報告
rm -rf frontend/coverage/
rm -rf backend/coverage/

# 清理測試快照
npm test -- --clearCache
```

### 重置測試數據
測試使用模擬數據，不會影響實際資料庫。如果需要重置測試環境：

```bash
# 清理 Jest 快取
npx jest --clearCache

# 重新安裝依賴
rm -rf node_modules/
npm install
```

## 🐛 常見問題

### 測試失敗
1. **檢查依賴**: 確保所有測試依賴已安裝
2. **檢查配置**: 驗證 Jest 配置文件
3. **檢查路徑**: 確保測試文件路徑正確
4. **檢查模擬**: 驗證 Mock 設置

### 覆蓋率為 0
1. **檢查配置**: 驗證 `collectCoverageFrom` 設置
2. **檢查路徑**: 確保源文件路徑正確
3. **檢查排除**: 驗證沒有過度排除文件

### 測試超時
1. **增加超時時間**: 在 Jest 配置中設置 `testTimeout`
2. **檢查異步**: 確保正確處理 Promise 和 async/await
3. **檢查模擬**: 驗證 Mock 函數的響應時間

## 📚 最佳實踐

### 測試組織
- 使用描述性的測試名稱
- 按功能分組測試
- 使用 `beforeEach` 和 `afterEach` 清理
- 保持測試獨立性

### 測試數據
- 使用工廠函數創建測試數據
- 避免硬編碼的測試數據
- 使用隨機數據避免測試依賴

### 模擬策略
- 模擬外部依賴（API、資料庫）
- 模擬複雜的第三方庫
- 使用真實的用戶事件模擬

### 斷言策略
- 測試行為而非實現
- 使用語義化的斷言
- 避免過度斷言
- 測試錯誤情況

## 🚀 持續整合

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm test -- --coverage
```

### 預提交鉤子
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
```

## 📞 支援

如果遇到測試問題：

1. **檢查日誌**: 查看測試輸出和錯誤訊息
2. **檢查配置**: 驗證 Jest 和測試配置
3. **檢查依賴**: 確保所有測試依賴已安裝
4. **檢查版本**: 驗證 Node.js 和 npm 版本

---

**測試是代碼質量的重要保障，定期運行測試可以及早發現問題並確保功能正常運作。**

---

## 🔗 相關文檔

- **[🧪 測試完整指南](./TESTING_README.md)** - 從零開始的完整測試設置指南
- **[📚 專案 README](./README.md)** - 專案概述和基本設置
- **[🔐 環境變數設置](./backend/ENV_SETUP.md)** - 後端環境配置說明
