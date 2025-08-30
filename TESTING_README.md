# 🧪 Calendar Todo App 測試完整指南

> 📖 **用途**: 完整入門指南、環境設置、從零開始的測試流程  
> 🎯 **目標讀者**: 新團隊成員、項目新手、需要完整設置的開發者

## 📋 目錄

- [測試概述](#測試概述)
- [前置條件](#前置條件)
- [測試結構](#測試結構)
- [執行測試](#執行測試)
- [測試案例詳解](#測試案例詳解)
- [故障排除](#故障排除)
- [最佳實踐](#最佳實踐)

## 🎯 測試概述

本專案包含完整的前端和後端測試套件，使用 Jest 作為測試框架，確保代碼質量和功能穩定性。

### 🏗️ 技術棧

- **測試框架**: Jest
- **前端測試**: React Testing Library + user-event
- **後端測試**: Supertest + Jest
- **覆蓋率**: Jest Coverage
- **模擬**: Jest Mocks

## ⚙️ 前置條件

### 1. 環境配置

#### 🔐 後端環境變數 (.env)

在 `backend/` 目錄下創建 `.env` 文件：

```bash
# 資料庫配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calendar_todo
DB_USER=rwuser
DB_PASSWORD=your_secure_password

# 後端配置
PORT=4000
NODE_ENV=development
```

#### 📁 資料庫設置

確保 PostgreSQL 運行並創建必要的資料庫和用戶：

```sql
-- 創建資料庫
CREATE DATABASE calendar_todo;

-- 創建用戶（如果不存在）
CREATE USER rwuser WITH PASSWORD 'your_secure_password';

-- 授予權限
GRANT CONNECT ON DATABASE calendar_todo TO rwuser;
GRANT USAGE ON SCHEMA public TO rwuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rwuser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rwuser;

-- 設置默認權限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rwuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO rwuser;
```

#### 🗄️ 資料表結構

執行 `backend/setup-db.sql` 創建必要的資料表：

```bash
cd backend
psql -U rwuser -d calendar_todo -f setup-db.sql
```

### 2. 依賴安裝

```bash
# 安裝後端依賴
cd backend
npm install

# 安裝前端依賴
cd ../frontend
npm install
```

## 🏗️ 測試結構

```
calendar-todo-app/
├── backend/
│   ├── __tests__/
│   │   ├── setup.js              # 後端測試設置
│   │   ├── routes/
│   │   │   ├── todos.test.js     # 待辦事項路由測試
│   │   │   └── events.test.js    # 事件路由測試
│   │   └── middleware/
│   │       └── logger.test.js    # 日誌中間件測試
│   ├── jest.config.js            # 後端 Jest 配置
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   └── api.test.js       # API 函數測試
│   │   └── components/
│   │       └── __tests__/
│   │           ├── TodoList.test.jsx      # 待辦事項組件測試
│   │           └── CalendarView.test.jsx  # 行事曆組件測試
│   ├── jest.config.js            # 前端 Jest 配置
│   ├── .babelrc                  # Babel 配置
│   └── package.json
├── run-tests.sh                  # 自動化測試腳本
└── TESTING_README.md             # 本文件
```

## 🚀 執行測試

### 方法 1: 使用自動化腳本（推薦）

```bash
# 在專案根目錄執行
./run-tests.sh
```

### 方法 2: 手動執行

#### 後端測試
```bash
cd backend
npm test                    # 執行所有測試
npm run test:watch         # 監視模式
npm run test:coverage      # 生成覆蓋率報告
```

#### 前端測試
```bash
cd frontend
npm test                    # 執行所有測試
npm run test:watch         # 監視模式
npm run test:coverage      # 生成覆蓋率報告
```

## 📊 測試案例詳解

### 🔧 後端測試

#### 1. 待辦事項路由測試 (`todos.test.js`)

**測試覆蓋範圍**:
- ✅ GET `/api/todos` - 獲取所有待辦事項
- ✅ POST `/api/todos` - 創建新待辦事項
- ✅ PUT `/api/todos/:id` - 更新待辦事項
- ✅ DELETE `/api/todos/:id` - 刪除待辦事項

**測試案例**:
- 成功獲取待辦事項列表
- 資料庫錯誤處理
- 創建待辦事項（包含驗證）
- 缺少標題時的錯誤處理
- 更新完成狀態
- 更新標題和日期
- 刪除待辦事項
- 資源不存在時的錯誤處理

#### 2. 事件路由測試 (`events.test.js`)

**測試覆蓋範圍**:
- ✅ GET `/api/events` - 獲取所有事件
- ✅ POST `/api/events` - 創建新事件
- ✅ PUT `/api/events/:id` - 更新事件
- ✅ DELETE `/api/events/:id` - 刪除事件

**測試案例**:
- 成功獲取事件列表
- 資料庫錯誤處理
- 創建事件（包含驗證）
- 缺少必填欄位的錯誤處理
- 更新事件資訊
- 刪除事件
- 資源不存在時的錯誤處理

#### 3. 日誌中間件測試 (`logger.test.js`)

**測試覆蓋範圍**:
- ✅ 請求日誌記錄
- ✅ 響應狀態記錄
- ✅ POST 請求的響應數據記錄
- ✅ 無效 JSON 處理
- ✅ 中間件鏈調用

**測試案例**:
- GET 請求的日誌記錄
- POST 請求的完整日誌記錄
- 非 200 狀態的響應記錄
- 無效 JSON 響應的錯誤處理
- next() 函數的正確調用

### 🎨 前端測試

#### 1. 待辦事項組件測試 (`TodoList.test.jsx`)

**測試覆蓋範圍**:
- ✅ 組件渲染
- ✅ 新增待辦事項
- ✅ 完成/取消完成待辦事項
- ✅ 刪除待辦事項
- ✅ 批量刪除已完成項目
- ✅ 錯誤處理
- ✅ 載入狀態

**測試案例**:
- 正確顯示組件標題和輸入框
- 新增待辦事項功能
- 待辦事項列表渲染
- 完成狀態切換
- 個別刪除功能
- 批量刪除已完成項目
- 錯誤訊息顯示
- 載入指示器

#### 2. 行事曆組件測試 (`CalendarView.test.jsx`)

**測試覆蓋範圍**:
- ✅ 組件渲染
- ✅ 新增事件
- ✅ 編輯事件
- ✅ 刪除事件
- ✅ 快速時長設置
- ✅ 時間驗證
- ✅ 錯誤處理

**測試案例**:
- 顯示行事曆標題和新增按鈕
- 行事曆事件渲染
- 新增事件對話框
- 編輯事件功能
- 刪除事件確認
- 快速時長按鈕
- 時間驗證邏輯
- API 錯誤處理

#### 3. API 函數測試 (`api.test.js`)

**測試覆蓋範圍**:
- ✅ 待辦事項 API 調用
- ✅ 事件 API 調用
- ✅ 錯誤處理
- ✅ 請求參數

**測試案例**:
- GET 請求的正確端點調用
- POST 請求的數據傳遞
- PUT 請求的 ID 和數據處理
- DELETE 請求的 ID 處理
- 錯誤響應的處理

## 🔍 測試覆蓋率

### 後端覆蓋率目標
- **語句覆蓋率**: > 90%
- **分支覆蓋率**: > 85%
- **函數覆蓋率**: > 90%
- **行覆蓋率**: > 90%

### 前端覆蓋率目標
- **語句覆蓋率**: > 80%
- **分支覆蓋率**: > 75%
- **函數覆蓋率**: > 85%
- **行覆蓋率**: > 80%

## 🚨 故障排除

### 常見問題

#### 1. 環境變數錯誤
```
❌ 缺少必要的環境變數: DB_USER, DB_PASSWORD
```
**解決方案**: 檢查 `backend/.env` 文件是否正確配置

#### 2. 資料庫連接失敗
```
❌ 資料庫連接失敗: connection refused
```
**解決方案**: 
- 確保 PostgreSQL 服務正在運行
- 檢查資料庫用戶權限
- 驗證連接參數

#### 3. 前端測試依賴錯誤
```
npm error ERESOLVE unable to resolve dependency tree
```
**解決方案**: 
- 清除 `node_modules` 和 `package-lock.json`
- 重新安裝依賴
- 檢查版本兼容性

#### 4. Jest 配置錯誤
```
Jest did not exit one second after the test run has completed
```
**解決方案**: 
- 檢查是否有未清理的定時器
- 確保所有異步操作正確完成
- 使用 `--detectOpenHandles` 參數

### 調試技巧

#### 後端測試調試
```bash
# 詳細日誌
npm test -- --verbose

# 單個測試文件
npm test -- todos.test.js

# 單個測試案例
npm test -- --testNamePattern="應該創建新的待辦事項"
```

#### 前端測試調試
```bash
# 詳細日誌
npm test -- --verbose

# 單個組件測試
npm test -- TodoList.test.jsx

# 監視模式（推薦開發時使用）
npm run test:watch
```

## 💡 最佳實踐

### 1. 測試編寫原則

- **AAA 模式**: Arrange（準備）、Act（執行）、Assert（斷言）
- **單一職責**: 每個測試只測試一個功能點
- **描述性命名**: 測試名稱清楚描述測試目的
- **獨立性**: 測試之間不依賴，可以單獨運行

### 2. 測試數據管理

- **使用工廠函數**: 創建測試數據
- **清理機制**: 每個測試後清理狀態
- **模擬外部依賴**: 使用 Jest mocks 隔離測試

### 3. 持續集成

- **自動化測試**: 每次提交自動運行測試
- **覆蓋率門檻**: 設置最低覆蓋率要求
- **測試報告**: 生成詳細的測試報告

## 📈 性能優化

### 測試執行優化

- **並行執行**: 使用 Jest 的並行執行功能
- **緩存**: 利用 Jest 的緩存機制
- **選擇性測試**: 只運行相關的測試文件

### 記憶體管理

- **清理資源**: 及時清理測試創建的資源
- **模擬清理**: 正確清理 Jest mocks
- **定時器管理**: 清理所有定時器和異步操作

## 🔄 維護和更新

### 定期維護

- **依賴更新**: 定期更新測試依賴
- **配置檢查**: 檢查 Jest 配置是否過時
- **覆蓋率分析**: 分析測試覆蓋率趨勢

### 測試擴展

- **新功能測試**: 為新功能添加測試
- **邊界情況**: 增加邊界情況的測試
- **性能測試**: 添加性能相關的測試

---

## 📞 支援

如果遇到測試問題，請：

1. 檢查本文件的前置條件
2. 查看錯誤日誌和堆疊追蹤
3. 確認環境配置正確
4. 參考故障排除部分
5. 檢查測試覆蓋率報告

**記住**: 良好的測試是代碼質量的保障！🧪✨

---

## 🔗 相關文檔

- **[🧪 測試技術參考文檔](./TESTING_REFERENCE.md)** - 詳細的測試案例和技術配置
- **[📚 專案 README](./README.md)** - 專案概述和基本設置
- **[🔐 環境變數設置](./backend/ENV_SETUP.md)** - 後端環境配置說明
