# Calendar Todo App

一個整合待辦事項清單和行事曆的應用程式，使用 React 前端和 Node.js 後端。

## 專案結構

```
calendar-todo-app/
├── backend/               # Node.js + Express
│   ├── package.json
│   ├── index.js
│   ├── db.js
│   ├── .env              # 環境變數配置
│   ├── routes/
│   │   ├── todos.js
│   │   └── events.js
│   └── __tests__/        # 後端測試
│       ├── routes/
│       ├── middleware/
│       └── setup.js
│
├── frontend/              # React + Vite
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/
│   │       ├── TodoList.jsx
│   │       └── CalendarView.jsx
│   └── src/components/__tests__/  # 前端測試
│
├── run-tests.sh          # 自動化測試腳本
├── TESTING_README.md     # 完整測試指南
└── TESTING_REFERENCE.md  # 測試技術參考
```

## 功能特色

- ✅ 待辦事項管理
- 📅 行事曆檢視
- 🔄 即時資料同步
- 🎨 Material Design 3 UI 設計
- 📱 響應式設計
- 🎭 流暢動畫效果
- ♿ 無障礙設計支援

## 快速開始

### 後端設定

1. 進入後端目錄：
```bash
cd backend
```

2. 安裝依賴：
```bash
npm install
```

3. 設定 PostgreSQL 資料庫（參考 backend/README.md）

4. 啟動伺服器：
```bash
npm start
```

### 測試設定

專案包含完整的前端和後端測試套件：

#### 🧪 快速測試
```bash
# 在專案根目錄執行自動化測試
./run-tests.sh
```

#### 📚 測試文檔
- **[🧪 完整測試指南](./TESTING_README.md)** - 新團隊成員必讀，包含環境設置、資料庫配置、完整測試流程
- **[🧪 測試技術參考](./TESTING_REFERENCE.md)** - 開發者快速查詢，包含測試案例、Jest 配置、故障排除

#### 🔧 手動測試
```bash
# 後端測試
cd backend
npm test

# 前端測試  
cd frontend
npm test
```

### 前端設定

1. 進入前端目錄：
```bash
cd frontend
```

2. 安裝依賴：
```bash
npm install
```

3. 啟動開發伺服器：
```bash
npm run dev
```

## 技術棧

- **前端**: React 18, Vite, FullCalendar, Material-UI (MUI)
- **後端**: Node.js, Express, PostgreSQL
- **API**: RESTful API with CORS support
- **設計系統**: Material Design 3
- **測試框架**: Jest, React Testing Library, Supertest
- **測試覆蓋**: 前端 80%+, 後端 90%+

## 🧪 測試與品質保證

### 測試策略
專案採用全面的測試策略，確保代碼質量和功能穩定性：

- **單元測試**: 組件和函數的獨立測試
- **整合測試**: API 端點和資料庫操作測試
- **端到端測試**: 用戶操作流程測試
- **覆蓋率監控**: 持續追蹤測試覆蓋率

### 📊 測試統計
- **總測試案例**: 87+ 個測試
- **後端測試**: 32 個測試案例，涵蓋所有 API 端點
- **前端測試**: 55 個測試案例，涵蓋所有主要組件
- **測試環境**: 模擬資料庫和 API 調用

### 🚀 持續整合
- 自動化測試腳本 (`run-tests.sh`)
- 測試覆蓋率報告
- 預提交測試檢查
- CI/CD 管道整合
