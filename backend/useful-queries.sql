-- ========================================
-- 實用的 SQL 查詢腳本
-- 使用 rwuser 用戶執行
-- ========================================

-- 1. 查看所有表的結構
\d

-- 2. 查看 todos 表結構
\d todos

-- 3. 查看 calendar_events 表結構
\d calendar_events

-- 4. 查看所有待辦事項（按創建時間排序）
SELECT 
  id,
  title,
  CASE 
    WHEN completed THEN '✅ 已完成'
    ELSE '⏳ 待完成'
  END as status,
  due_date,
  created_at
FROM todos 
ORDER BY created_at DESC;

-- 5. 查看所有事件（按開始時間排序）
SELECT 
  id,
  title,
  start_time,
  end_time,
  created_at
FROM calendar_events 
ORDER BY start_time ASC;

-- 6. 統計待辦事項完成情況
SELECT 
  COUNT(*) as total_todos,
  COUNT(CASE WHEN completed = true THEN 1 END) as completed_todos,
  COUNT(CASE WHEN completed = false THEN 1 END) as pending_todos,
  ROUND(
    COUNT(CASE WHEN completed = true THEN 1 END) * 100.0 / COUNT(*), 
    1
  ) as completion_rate
FROM todos;

-- 7. 查看有截止日期的待辦事項
SELECT 
  id,
  title,
  due_date,
  CASE 
    WHEN due_date < CURRENT_DATE THEN '⚠️ 已逾期'
    WHEN due_date = CURRENT_DATE THEN '🔴 今天到期'
    WHEN due_date <= CURRENT_DATE + INTERVAL '7 days' THEN '🟡 即將到期'
    ELSE '🟢 還有時間'
  END as due_status
FROM todos 
WHERE due_date IS NOT NULL
ORDER BY due_date ASC;

-- 8. 查看本月的事件
SELECT 
  id,
  title,
  start_time,
  end_time
FROM calendar_events 
WHERE start_time >= date_trunc('month', CURRENT_DATE)
AND start_time < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
ORDER BY start_time ASC;

-- 9. 查看待辦事項的創建趨勢（按日期分組）
SELECT 
  DATE(created_at) as create_date,
  COUNT(*) as todos_created
FROM todos 
GROUP BY DATE(created_at)
ORDER BY create_date DESC
LIMIT 10;

-- 10. 查看事件時長統計
SELECT 
  id,
  title,
  start_time,
  end_time,
  EXTRACT(EPOCH FROM (end_time - start_time)) / 3600 as duration_hours
FROM calendar_events 
ORDER BY duration_hours DESC;

-- 11. 查看所有表的記錄數
SELECT 
  'todos' as table_name,
  COUNT(*) as record_count
FROM todos
UNION ALL
SELECT 
  'calendar_events' as table_name,
  COUNT(*) as record_count
FROM calendar_events;

-- 12. 查看最近的活動（混合待辦事項和事件）
SELECT 
  'todo' as type,
  id,
  title,
  created_at,
  CASE WHEN completed THEN '已完成' ELSE '待完成' END as status
FROM todos
UNION ALL
SELECT 
  'event' as type,
  id,
  title,
  created_at,
  '事件' as status
FROM calendar_events
ORDER BY created_at DESC
LIMIT 20;
