# 📅 Calendar Todo App

一個功能完整的待辦事項和日曆事件管理應用，採用現代化的技術棧和專業的軟體架構。

## 🌟 專案特色

- **🎯 雙重功能**: 待辦事項管理 + 日曆事件規劃
- **🎨 現代化 UI**: Material Design 3 設計語言
- **📱 響應式設計**: 完美適配各種設備尺寸
- **⚡ 高效能**: 優化的前端渲染和後端 API
- **🛡️ 企業級安全**: 專業的安全防護和驗證
- **🧪 完整測試**: 高覆蓋率的測試套件

## 🏗️ 架構設計

### **前端架構**
- **React 18**: 最新的 React 特性
- **Vite**: 極速的建構工具
- **Material-UI (MUI)**: Google Material Design 3 實現
- **FullCalendar**: 專業的日曆組件
- **狀態管理**: React Hooks + Context API

### **後端架構** ⭐ **NEW!**
- **清潔架構**: 專業的分層設計模式
- **分層結構**: Controllers → Services → Repositories → Models
- **中間件系統**: 安全、日誌、錯誤處理、驗證
- **資料庫優化**: 連接池管理、查詢優化
- **API 設計**: RESTful + 統一錯誤處理

#### **後端架構圖**
```
┌─────────────────┐
│   Controllers   │ ← HTTP 請求和響應處理
├─────────────────┤
│    Services     │ ← 業務邏輯層
├─────────────────┤
│  Repositories   │ ← 資料訪問層
├─────────────────┤
│     Models      │ ← 資料模型和驗證
├─────────────────┤
│   Database      │ ← PostgreSQL 資料庫
└─────────────────┘
```

## 🚀 快速開始

### 前置需求
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 1. 克隆專案
```bash
git clone https://github.com/yourusername/calendar-todo-app.git
cd calendar-todo-app
```

### 2. 後端設置
```bash
cd backend
cp .env.example .env
# 編輯 .env 文件，填入資料庫資訊
npm install
npm run dev
```

### 3. 前端設置
```bash
cd frontend
npm install
npm run dev
```

### 4. 資料庫設置
```bash
# 使用 psql 連接到 PostgreSQL
psql -U rwuser -d calendar_todo -f setup-db.sql
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

## 🛠️ 技術棧

### **前端技術**
- **框架**: React 18 + Vite
- **UI 庫**: Material-UI (MUI) v5
- **日曆**: FullCalendar v6
- **樣式**: Emotion (CSS-in-JS)
- **HTTP 客戶端**: Axios
- **測試**: Jest + React Testing Library

### **後端技術** ⭐ **重構升級！**
- **運行時**: Node.js + Express
- **資料庫**: PostgreSQL + pg 驅動
- **架構模式**: 清潔架構 (Clean Architecture)
- **驗證**: express-validator
- **安全**: Helmet + express-rate-limit
- **日誌**: Winston
- **測試**: Jest + Supertest

### **開發工具**
- **版本控制**: Git
- **包管理**: npm
- **建構工具**: Vite (前端)
- **代碼品質**: ESLint + Prettier
- **測試覆蓋**: 前端 80%+, 後端 90%+

## 🔐 環境變數配置

### **後端環境變數**
```bash
# 資料庫配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calendar_todo
DB_USER=rwuser
DB_PASSWORD=your_password

# 後端配置
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# 安全配置
JWT_SECRET=your-secret-key
RATE_LIMIT_MAX=100
```

詳細配置說明請參考：[後端環境配置](./backend/ENV_SETUP.md)

## 📚 API 文檔

### **基礎端點**
- `GET /health` - 系統健康檢查
- `GET /` - API 資訊

### **待辦事項 API**
- `GET /api/todos` - 獲取所有待辦事項
- `POST /api/todos` - 創建新待辦事項
- `PUT /api/todos/:id` - 更新待辦事項
- `DELETE /api/todos/:id` - 刪除待辦事項
- `PATCH /api/todos/:id/toggle` - 切換完成狀態
- `DELETE /api/todos/completed/bulk` - 批量刪除已完成
- `GET /api/todos/stats` - 獲取統計資訊

### **事件 API**
- `GET /api/events` - 獲取所有事件
- `POST /api/events` - 創建新事件
- `PUT /api/events/:id` - 更新事件
- `DELETE /api/events/:id` - 刪除事件
- `GET /api/events/upcoming` - 獲取即將到來的事件
- `GET /api/events/stats` - 獲取事件統計

完整 API 文檔請參考：[API 文檔](./backend/API_DOCS.md)

## 🧪 測試與品質保證

### **測試策略**
專案採用全面的測試策略，確保代碼質量和功能穩定性：

- **單元測試**: 組件和函數的獨立測試
- **整合測試**: API 端點和資料庫操作測試
- **端到端測試**: 用戶操作流程測試
- **覆蓋率監控**: 持續追蹤測試覆蓋率

### **📊 測試統計**
- **總測試案例**: 87+ 個測試
- **後端測試**: 32 個測試案例，涵蓋所有 API 端點
- **前端測試**: 55 個測試案例，涵蓋所有主要組件
- **測試環境**: 模擬資料庫和 API 調用

### **🚀 持續整合**
- 自動化測試腳本 (`run-tests.sh`)
- 測試覆蓋率報告
- 預提交測試檢查
- CI/CD 管道整合

## 🔄 最近重大更新

### **v2.0.0 - 後端架構完美重構** ⭐ **NEW!**

#### **🏗️ 架構重構**
- 從單一文件重構為專業分層架構
- 實現清潔架構 (Clean Architecture) 設計模式
- 新增 Controllers、Services、Repositories、Models 層

#### **🔒 安全性大幅提升**
- 集成 Helmet 安全頭部
- 實現 API 速率限制
- 添加輸入驗證和清理
- 強化 CORS 安全配置

#### **📊 專業日誌系統**
- 使用 Winston 替代 console.log
- 實現日誌輪轉和文件管理
- 結構化日誌格式

#### **🛡️ 錯誤處理優化**
- 統一錯誤處理中間件
- 詳細錯誤分類和響應
- 生產環境安全配置

#### **⚡ 性能優化**
- 資料庫連接池管理
- 壓縮中間件
- 健康檢查端點
- 優雅關閉處理

#### **🧪 測試架構改進**
- 模型驗證測試
- 業務邏輯測試
- 錯誤處理測試
- 測試覆蓋率提升

## 🚀 部署

### **開發環境**
```bash
# 後端
cd backend
npm run dev

# 前端
cd frontend
npm run dev
```

### **生產環境**
```bash
# 後端
cd backend
NODE_ENV=production npm start

# 前端
cd frontend
npm run build
```

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 🔗 相關文檔

- **[🧪 測試完整指南](./TESTING_README.md)** - 從零開始的完整測試設置指南
- **[🧪 測試技術參考](./TESTING_REFERENCE.md)** - 技術參考、測試案例查詢、開發者快速查詢
- **[🔐 環境變數設置](./backend/ENV_SETUP.md)** - 後端環境配置說明
- **[📚 API 文檔](./backend/API_DOCS.md)** - 完整的 API 參考文檔

---

**🎉 專案已升級到企業級標準！** 採用清潔架構、專業安全配置、完整測試覆蓋，適合生產環境部署和團隊開發。
