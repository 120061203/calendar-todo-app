-- 強制時區修復腳本 - 解決 18:30 變成 02:30 的問題
-- 在 Supabase SQL Editor 中執行此腳本

-- 1. 檢查當前表結構和數據
SELECT '=== 修復前的表結構 ===' as info;
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('todos', 'calendar_events')
ORDER BY table_name, ordinal_position;

SELECT '=== 修復前的數據樣本 ===' as info;
SELECT 'todos:' as table_name, id, title, created_at FROM todos LIMIT 3;
SELECT 'calendar_events:' as table_name, id, title, start_time, end_time FROM calendar_events LIMIT 3;

-- 2. 備份現有數據
CREATE TABLE IF NOT EXISTS calendar_events_backup AS SELECT * FROM calendar_events;
CREATE TABLE IF NOT EXISTS todos_backup AS SELECT * FROM todos;

-- 3. 刪除現有表
DROP TABLE IF EXISTS calendar_events;
DROP TABLE IF EXISTS todos;

-- 4. 重新建立表，強制使用 TIMESTAMP WITHOUT TIME ZONE
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

-- 5. 恢復數據，強制轉換為本地時間
INSERT INTO todos (id, title, due_date, created_at)
SELECT 
  id, 
  title, 
  due_date, 
  -- 強制轉換為本地時間，不進行時區轉換
  created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Taipei'
FROM todos_backup;

INSERT INTO calendar_events (id, title, start_time, end_time, created_at)
SELECT 
  id, 
  title, 
  -- 強制轉換為本地時間，不進行時區轉換
  start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Taipei',
  end_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Taipei',
  created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Taipei'
FROM calendar_events_backup;

-- 6. 重置序列
SELECT setval('todos_id_seq', (SELECT MAX(id) FROM todos));
SELECT setval('calendar_events_id_seq', (SELECT MAX(id) FROM calendar_events));

-- 7. 刪除備份表
DROP TABLE calendar_events_backup;
DROP TABLE todos_backup;

-- 8. 驗證修復結果
SELECT '=== 修復後的表結構 ===' as info;
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('todos', 'calendar_events')
ORDER BY table_name, ordinal_position;

SELECT '=== 修復後的數據樣本 ===' as info;
SELECT 'todos:' as table_name, id, title, created_at FROM todos LIMIT 3;
SELECT 'calendar_events:' as table_name, id, title, start_time, end_time FROM calendar_events LIMIT 3;

SELECT '=== 時區修復完成！===' as status;
SELECT '現在設定 18:30 應該會保持 18:30，不會變成 02:30' as note;
