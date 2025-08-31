-- 時區修正遷移腳本
-- 將 TIMESTAMP 欄位改為 TIMESTAMP WITHOUT TIME ZONE 以避免時區轉換問題

-- 連接到資料庫
\c calendar_todo;

-- 備份現有數據
CREATE TABLE calendar_events_backup AS SELECT * FROM calendar_events;
CREATE TABLE todos_backup AS SELECT * FROM todos;

-- 刪除現有表
DROP TABLE calendar_events;
DROP TABLE todos;

-- 重新建立表，使用 TIMESTAMP WITHOUT TIME ZONE
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

-- 恢復數據（注意：時間數據會保持原樣，不會進行時區轉換）
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

-- 驗證結果
SELECT 'Migration completed successfully!' as status;
SELECT 'Todos:' as table_name;
SELECT * FROM todos;
SELECT 'Events:' as table_name;
SELECT * FROM calendar_events;
