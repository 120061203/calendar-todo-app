-- Supabase 資料庫設置腳本
-- 注意：Supabase 已經有 postgres 資料庫，不需要創建新的

-- 建立待辦事項表
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 建立行事曆事件表
CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 創建索引以提高查詢性能
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON calendar_events(start_time ASC);

-- 創建更新時間的觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為兩個表添加更新時間觸發器
CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON calendar_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入一些測試資料
INSERT INTO todos (title, due_date, completed) VALUES 
  ('完成專案文件', '2024-01-15', false),
  ('準備會議簡報', '2024-01-20', false),
  ('回覆客戶郵件', '2024-01-18', true)
ON CONFLICT DO NOTHING;

INSERT INTO calendar_events (title, start_time, end_time) VALUES 
  ('團隊會議', '2024-01-15 09:00:00+00', '2024-01-15 10:00:00+00'),
  ('客戶拜訪', '2024-01-16 14:00:00+00', '2024-01-16 16:00:00+00'),
  ('專案檢討', '2024-01-17 13:00:00+00', '2024-01-17 15:00:00+00')
ON CONFLICT DO NOTHING;

-- 顯示建立的資料
SELECT 'Todos:' as table_name;
SELECT * FROM todos;

SELECT 'Events:' as table_name;
SELECT * FROM calendar_events;

-- 顯示表結構
SELECT 'Table Structure:' as info;
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name IN ('todos', 'calendar_events')
ORDER BY table_name, ordinal_position;
