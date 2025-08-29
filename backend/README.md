# Calendar Todo Backend

## 設定資料庫

1. 安裝 PostgreSQL
2. 建立資料庫：
```sql
CREATE DATABASE calendar_todo;
```

3. 建立資料表：
```sql
-- 待辦事項表
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 行事曆事件表
CREATE TABLE calendar_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 安裝依賴

```bash
npm install
```

## 啟動伺服器

```bash
npm start
```

伺服器將在 http://localhost:4000 上運行
