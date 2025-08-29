#!/bin/bash

# 快速查看資料庫內容腳本
# 使用 rwuser 用戶

echo "🗄️  快速查看 calendar_todo 資料庫內容"
echo "=================================="

# 設定資料庫連線參數
DB_USER="rwuser"
DB_PASS="rwuser123"
DB_NAME="calendar_todo"

echo ""
echo "📊 1. 待辦事項統計"
PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -c "
SELECT 
  COUNT(*) as total_todos,
  COUNT(CASE WHEN completed = true THEN 1 END) as completed_todos,
  COUNT(CASE WHEN completed = false THEN 1 END) as pending_todos
FROM todos;"

echo ""
echo "📅 2. 事件統計"
PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -c "
SELECT COUNT(*) as total_events FROM calendar_events;"

echo ""
echo "📝 3. 最近的待辦事項（前5個）"
PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -c "
SELECT id, title, completed, created_at 
FROM todos 
ORDER BY created_at DESC 
LIMIT 5;"

echo ""
echo "🎯 4. 即將到期的待辦事項"
PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -c "
SELECT id, title, due_date
FROM todos 
WHERE due_date IS NOT NULL 
AND due_date >= CURRENT_DATE
ORDER BY due_date ASC
LIMIT 5;"

echo ""
echo "✅ 5. 已完成的待辦事項"
PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -c "
SELECT id, title, completed_at
FROM todos 
WHERE completed = true
ORDER BY created_at DESC
LIMIT 5;"

echo ""
echo "📋 6. 所有表的記錄數"
PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -c "
SELECT 
  'todos' as table_name,
  COUNT(*) as record_count
FROM todos
UNION ALL
SELECT 
  'calendar_events' as table_name,
  COUNT(*) as record_count
FROM calendar_events;"

echo ""
echo "🎉 查詢完成！"
