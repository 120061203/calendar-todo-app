# 📚 Calendar Todo API 文檔

## 🌟 概述

Calendar Todo API 是一個專業的待辦事項和日曆事件管理系統，採用清潔架構設計，提供完整的 CRUD 操作和進階功能。

**版本**: 2.0.0  
**基礎 URL**: `http://localhost:4000`  
**API 版本**: `/api`

## 🔐 認證

目前 API 處於開發模式，無需認證。生產環境建議啟用 JWT 認證。

## 📊 健康檢查

### 獲取系統狀態
```http
GET /health
```

**響應示例**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": "3600s",
  "database": "connected",
  "memory": {
    "rss": "45MB",
    "heapUsed": "25MB",
    "heapTotal": "35MB"
  },
  "environment": "development"
}
```

## 📝 待辦事項 API

### 獲取所有待辦事項
```http
GET /api/todos
```

**響應**: 200 OK
```json
[
  {
    "id": 1,
    "title": "完成專案文檔",
    "due_date": "2024-01-20T00:00:00.000Z",
    "completed": false,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 獲取特定待辦事項
```http
GET /api/todos/:id
```

**參數**:
- `id` (path): 待辦事項 ID

**響應**: 200 OK 或 404 Not Found

### 創建待辦事項
```http
POST /api/todos
Content-Type: application/json
```

**請求體**:
```json
{
  "title": "新待辦事項",
  "due_date": "2024-01-25T00:00:00.000Z"
}
```

**驗證規則**:
- `title`: 必填，1-255 字符
- `due_date`: 可選，ISO 8601 格式

**響應**: 201 Created

### 更新待辦事項
```http
PUT /api/todos/:id
Content-Type: application/json
```

**請求體**:
```json
{
  "title": "更新的標題",
  "due_date": "2024-01-30T00:00:00.000Z",
  "completed": true
}
```

**響應**: 200 OK 或 404 Not Found

### 刪除待辦事項
```http
DELETE /api/todos/:id
```

**響應**: 200 OK 或 404 Not Found

### 切換完成狀態
```http
PATCH /api/todos/:id/toggle
```

**響應**: 200 OK 或 404 Not Found

### 批量刪除已完成的待辦事項
```http
DELETE /api/todos/completed/bulk
```

**響應**: 200 OK

### 根據狀態獲取待辦事項
```http
GET /api/todos/status/:status
```

**參數**:
- `status` (path): `completed` 或 `pending`

### 搜索待辦事項
```http
GET /api/todos/search?q=關鍵字
```

**查詢參數**:
- `q`: 搜索關鍵字

### 獲取統計信息
```http
GET /api/todos/stats
```

**響應示例**:
```json
{
  "total": 10,
  "completed": 6,
  "pending": 4,
  "completionRate": 60
}
```

## 📅 日曆事件 API

### 獲取所有事件
```http
GET /api/events
```

### 獲取特定事件
```http
GET /api/events/:id
```

### 創建事件
```http
POST /api/events
Content-Type: application/json
```

**請求體**:
```json
{
  "title": "團隊會議",
  "start_time": "2024-01-15T14:00:00.000Z",
  "end_time": "2024-01-15T15:00:00.000Z"
}
```

**驗證規則**:
- `title`: 必填，1-255 字符
- `start_time`: 必填，ISO 8601 格式
- `end_time`: 必填，必須晚於 start_time

### 更新事件
```http
PUT /api/events/:id
Content-Type: application/json
```

### 刪除事件
```http
DELETE /api/events/:id
```

### 根據日期範圍獲取事件
```http
GET /api/events/range?start=2024-01-01&end=2024-01-31
```

**查詢參數**:
- `start`: 開始日期 (ISO 8601)
- `end`: 結束日期 (ISO 8601)

### 獲取即將到來的事件
```http
GET /api/events/upcoming?limit=5
```

**查詢參數**:
- `limit`: 限制數量 (默認 5)

### 搜索事件
```http
GET /api/events/search?q=關鍵字
```

### 獲取統計信息
```http
GET /api/events/stats
```

### 檢查事件可用性
```http
GET /api/events/:id/availability?start=2024-01-15T14:00:00.000Z&end=2024-01-15T15:00:00.000Z
```

**響應示例**:
```json
{
  "isAvailable": true,
  "hasConflict": false
}
```

## 🚨 錯誤處理

### 錯誤響應格式
```json
{
  "error": "錯誤類型",
  "message": "詳細錯誤信息"
}
```

### HTTP 狀態碼
- `200` OK: 請求成功
- `201` Created: 資源創建成功
- `400` Bad Request: 請求參數錯誤
- `404` Not Found: 資源不存在
- `409` Conflict: 資源衝突
- `429` Too Many Requests: 請求過於頻繁
- `500` Internal Server Error: 服務器內部錯誤

### 常見錯誤
- **驗證錯誤**: 輸入數據不符合要求
- **時間衝突**: 事件時間與現有事件衝突
- **資源不存在**: 請求的 ID 不存在
- **速率限制**: 超過 API 調用限制

## 🔧 開發工具

### 啟動開發服務器
```bash
npm run dev
```

### 運行測試
```bash
npm test
npm run test:coverage
```

### 代碼檢查
```bash
npm run lint
npm run format
```

### 安全審計
```bash
npm run security-audit
npm run security-fix
```

## 📈 性能優化

- **連接池管理**: 自動管理資料庫連接
- **壓縮**: 啟用 gzip 壓縮
- **快取**: Redis 快取支持
- **速率限制**: 防止 API 濫用
- **日誌輪轉**: 自動管理日誌文件

## 🛡️ 安全特性

- **Helmet**: 安全頭部設置
- **CORS**: 跨域資源共享控制
- **輸入驗證**: 防止注入攻擊
- **速率限制**: 防止暴力攻擊
- **日誌記錄**: 完整的審計日誌

## 🔗 相關文檔

- [環境變數配置](./ENV_SETUP.md)
- [測試指南](../TESTING_README.md)
- [測試技術參考](../TESTING_REFERENCE.md)
- [專案 README](../README.md)
