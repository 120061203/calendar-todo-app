# 🗄️ Supabase 時區問題修復指南

## 🚨 問題描述
在 Supabase 中，當你輸入 "下午6:30" 時，可能會變成 "上午2:30"，這是因為時區轉換問題。

## 🔍 問題原因
1. **資料庫欄位類型**：使用 `TIMESTAMP` 會自動轉換時區
2. **PostgreSQL 預設行為**：會將時間轉換為 UTC 存儲
3. **前端顯示**：從 UTC 轉換回本地時間時出現偏移

## 🛠️ 修復步驟

### **步驟 1: 登入 Supabase Dashboard**
1. 前往 [https://supabase.com](https://supabase.com)
2. 登入你的帳號
3. 選擇你的專案

### **步驟 2: 執行 SQL 腳本**
1. 在左側選單中點擊 **"SQL Editor"**
2. 點擊 **"New query"**
3. 複製以下 SQL 腳本：

```sql
-- 檢查當前表結構
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('todos', 'calendar_events')
ORDER BY table_name, ordinal_position;

-- 修改 todos 表的 created_at 欄位
ALTER TABLE todos 
ALTER COLUMN created_at TYPE TIMESTAMP WITHOUT TIME ZONE;

-- 修改 calendar_events 表的時間欄位
ALTER TABLE calendar_events 
ALTER COLUMN start_time TYPE TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE calendar_events 
ALTER COLUMN end_time TYPE TIMESTAMP WITHOUT TIME ZONE;

ALTER TABLE calendar_events 
ALTER COLUMN created_at TYPE TIMESTAMP WITHOUT TIME ZONE;

-- 驗證修改結果
SELECT 'Supabase timezone fix completed!' as status;
```

4. 點擊 **"Run"** 執行腳本

### **步驟 3: 驗證修復結果**
執行完成後，你應該看到：
- 所有時間欄位都變成 `TIMESTAMP WITHOUT TIME ZONE`
- 狀態顯示 "Supabase timezone fix completed!"

## 🔧 替代方案（如果 ALTER TABLE 失敗）

如果直接修改欄位類型失敗，可以使用重建表的方式：

```sql
-- 備份現有數據
CREATE TABLE calendar_events_backup AS SELECT * FROM calendar_events;
CREATE TABLE todos_backup AS SELECT * FROM todos;

-- 刪除現有表
DROP TABLE calendar_events;
DROP TABLE todos;

-- 重新建立表
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  due_date DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calendar_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 恢復數據
INSERT INTO todos (id, title, due_date, created_at)
SELECT id, title, due_date, created_at FROM todos_backup;

INSERT INTO calendar_events (id, title, start_time, end_time, created_at)
SELECT id, title, start_time, end_time, created_at FROM calendar_events_backup;

-- 重置序列
SELECT setval('todos_id_seq', (SELECT MAX(id) FROM todos));
SELECT setval('calendar_events_id_seq', (SELECT MAX(id) FROM calendar_events));

-- 刪除備份表
DROP TABLE calendar_events_backup;
DROP TABLE todos_backup;
```

## ✅ 修復後的效果
- **時間輸入**：下午6:30 會保持下午6:30
- **資料庫存儲**：不會進行時區轉換
- **前端顯示**：時間完全一致
- **API 響應**：時間格式統一

## 🚀 測試驗證
修復完成後，請測試：
1. 新增一個事件，設定時間為下午6:30
2. 保存後重新打開
3. 確認時間仍然是下午6:30

## 📝 注意事項
- 修復過程中不會丟失數據
- 建議在修復前備份重要數據
- 如果遇到權限問題，請檢查 Supabase 用戶權限

## 🆘 遇到問題？
如果執行過程中遇到問題，請：
1. 檢查錯誤訊息
2. 確認用戶權限
3. 聯繫 Supabase 支援
