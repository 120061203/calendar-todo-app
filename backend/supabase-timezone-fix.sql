-- Supabase 時區問題修復腳本
-- 在 Supabase SQL Editor 中執行此腳本

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

-- 顯示修改後的表結構
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('todos', 'calendar_events')
ORDER BY table_name, ordinal_position;

-- 顯示一些數據作為驗證
SELECT 'Sample todos:' as info;
SELECT id, title, created_at FROM todos LIMIT 3;

SELECT 'Sample events:' as info;
SELECT id, title, start_time, end_time FROM calendar_events LIMIT 3;
