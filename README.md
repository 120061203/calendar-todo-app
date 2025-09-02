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

## 🌐 部署架構 ⭐ **NEW!**

### **生產環境部署**
本專案採用現代化的雲端部署架構，確保高可用性和效能：

#### **後端部署 (Vercel + Supabase)**
- **🚀 Vercel**: 無伺服器後端 API 部署
  - 自動擴展和負載平衡
  - 全球 CDN 加速
  - 自動 HTTPS 和安全防護
- **🗄️ Supabase**: PostgreSQL 雲端資料庫
  - 託管 PostgreSQL 14+
  - 自動備份和災難恢復
  - 內建連接池和效能優化
  - 實時資料庫變更通知

#### **前端部署 (GitHub Pages)**
- **📱 GitHub Pages**: 靜態前端網站託管
  - 自動部署和版本控制
  - 全球 CDN 分發
  - 免費託管和 SSL 證書

#### **部署架構圖**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Pages  │    │     Vercel      │    │    Supabase     │
│   (前端託管)    │◄──►│   (後端 API)    │◄──►│   (資料庫)      │
│                 │    │                 │    │                 │
│  React App      │    │  Express API    │    │  PostgreSQL     │
│  Material UI    │    │  Clean Arch     │    │  Connection     │
│  FullCalendar   │    │  Middleware     │    │  Pool           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **部署優勢**
- **🌍 全球可用**: 多區域 CDN 分發
- **⚡ 高效能**: 邊緣計算和資料庫優化
- **🛡️ 高安全**: 自動 HTTPS、WAF 防護
- **💰 成本效益**: 免費層級 + 按需付費
- **🔧 易維護**: 自動部署和監控

### **環境變數配置**
部署時需要配置以下環境變數：

#### **Vercel 環境變數**
```bash
# Supabase 資料庫配置
DB_HOST=aws-1-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.ijtxwcxrfsbdqcokdyni
DB_PASSWORD=your_password

# 後端配置
NODE_ENV=production
CORS_ORIGIN=https://120061203.github.io
JWT_SECRET=your_jwt_secret
RATE_LIMIT_MAX=100
```

#### **前端配置**
```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/calendar-todo-app/', // GitHub Pages 路徑配置
  // ... 其他配置
})
```

### **部署流程**
1. **後端部署**: 推送到 GitHub 自動觸發 Vercel 部署
2. **前端部署**: 執行 `./deploy-gh-pages.sh` 部署到 GitHub Pages
3. **資料庫**: Supabase 自動管理，無需手動部署

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
- `GET /api/health` - 系統健康檢查
- `GET /` - API 資訊和狀態

### **待辦事項 API** (`/api/todos`)
- `GET /` - 獲取所有待辦事項
- `GET /:id` - 獲取特定待辦事項
- `POST /` - 創建新待辦事項
- `PUT /:id` - 更新待辦事項
- `DELETE /:id` - 刪除待辦事項
- `PATCH /:id/toggle` - 切換完成狀態
- `DELETE /completed/bulk` - 批量刪除已完成的待辦事項
- `GET /status/:status` - 根據狀態獲取待辦事項
- `GET /search` - 搜索待辦事項
- `GET /stats` - 獲取待辦事項統計

### **事件 API** (`/api/events`)
- `GET /` - 獲取所有事件
- `GET /:id` - 獲取特定事件
- `POST /` - 創建新事件
- `PUT /:id` - 更新事件
- `DELETE /:id` - 刪除事件
- `GET /range` - 根據日期範圍獲取事件
- `GET /upcoming` - 獲取即將到來的事件
- `GET /search` - 搜索事件
- `GET /stats` - 獲取事件統計
- `GET /:id/availability` - 檢查事件可用性

### **API 響應格式**
所有 API 端點都遵循統一的響應格式：

#### **成功響應**
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

#### **錯誤響應**
```json
{
  "success": false,
  "error": "錯誤類型",
  "message": "詳細錯誤訊息",
  "details": { ... }
}
```

#### **HTTP 狀態碼**
- `200` - 成功
- `201` - 創建成功
- `400` - 請求參數錯誤
- `401` - 未授權
- `404` - 資源不存在
- `409` - 資源衝突
- `429` - 請求過於頻繁
- `500` - 伺服器內部錯誤
- `503` - 服務不可用

### **請求驗證**
所有 POST 和 PUT 請求都包含自動驗證：
- 必填欄位檢查
- 資料類型驗證
- 資料格式驗證
- 業務邏輯驗證

### **速率限制**
API 實施速率限制保護：
- 每分鐘最多 100 個請求
- 自動 IP 封鎖過於頻繁的請求
- 可配置的限制參數

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
# 測試自動部署
# Tue Sep  2 14:57:02 CST 2025
