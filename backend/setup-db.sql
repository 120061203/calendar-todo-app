-- 建立資料庫
CREATE DATABASE calendar_todo;

-- 連接到新建立的資料庫
\c calendar_todo;

-- 建立待辦事項表
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  due_date DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 建立行事曆事件表
CREATE TABLE calendar_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 插入一些測試資料
INSERT INTO todos (title, due_date) VALUES 
  ('完成專案文件', '2024-01-15'),
  ('準備會議簡報', '2024-01-20'),
  ('回覆客戶郵件', '2024-01-18');

INSERT INTO calendar_events (title, start_time, end_time) VALUES 
  ('團隊會議', '2024-01-15 09:00:00', '2024-01-15 10:00:00'),
  ('客戶拜訪', '2024-01-16 14:00:00', '2024-01-16 16:00:00'),
  ('專案檢討', '2024-01-17 13:00:00', '2024-01-17 15:00:00');

-- 顯示建立的資料
SELECT 'Todos:' as table_name;
SELECT * FROM todos;

SELECT 'Events:' as table_name;
SELECT * FROM calendar_events;
