# 環境變數配置說明

## 🔒 安全配置

為了保護資料庫憑證安全，請使用環境變數而不是明文存儲密碼。

## 📁 文件說明

- `.env` - 實際的環境變數文件（包含敏感資訊，不提交到 Git）
- `.env.example` - 環境變數範例文件（不包含敏感資訊，可提交到 Git）

## 🚀 快速設置

1. 複製範例文件：
   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 文件，填入實際的資料庫資訊：
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=calendar_todo
   DB_USER=rwuser
   DB_PASSWORD=your_actual_password
   PORT=4000
   NODE_ENV=development
   ```

## ⚠️ 安全注意事項

- **永遠不要**將 `.env` 文件提交到 Git
- **永遠不要**在程式碼中明文存儲密碼
- 使用強密碼並定期更換
- 在生產環境中使用更安全的密碼管理系統

## 🔧 生產環境

在生產環境中，建議：
- 使用 Docker secrets
- 使用 Kubernetes secrets
- 使用雲端服務的密碼管理系統
- 定期輪換資料庫密碼
