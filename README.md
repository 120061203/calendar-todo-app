# Calendar Todo App

一個整合待辦事項清單和行事曆的應用程式，使用 React 前端和 Node.js 後端。

## 專案結構

```
calendar-todo-app/
├── backend/               # Node.js + Express
│   ├── package.json
│   ├── index.js
│   ├── db.js
│   └── routes/
│       ├── todos.js
│       └── events.js
│
└── frontend/              # React + Vite
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   └── components/
    │       ├── TodoList.jsx
    │       └── CalendarView.jsx
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
