-- 時區問題快速修復腳本
-- 將 TIMESTAMP 欄位改為 TIMESTAMP WITHOUT TIME ZONE

-- 連接到資料庫
\c calendar_todo;

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
SELECT 'Timezone fix completed!' as status;

-- 顯示表結構
\d todos;
\d calendar_events;

-- 顯示一些數據作為驗證
SELECT 'Sample todos:' as info;
SELECT id, title, created_at FROM todos LIMIT 3;

SELECT 'Sample events:' as info;
SELECT id, title, start_time, end_time FROM calendar_events LIMIT 3;
