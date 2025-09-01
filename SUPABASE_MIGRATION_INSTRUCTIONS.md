# 🚨 Supabase 數據庫遷移指南

## 問題說明
重複事件功能無法正常工作的原因是 Supabase 數據庫缺少必要的欄位。

## 解決步驟

### 1. 登入 Supabase Dashboard
- 前往：https://supabase.com/dashboard
- 選擇你的專案

### 2. 執行 SQL 遷移
- 點擊左側選單的 **SQL Editor**
- 點擊 **New Query**
- 複製並貼上以下 SQL：

```sql
-- 添加行事曆增強功能
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS repeat_type VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS repeat_until DATE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS original_event_id INTEGER DEFAULT NULL;

-- 創建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_calendar_events_all_day ON calendar_events(is_all_day);
CREATE INDEX IF NOT EXISTS idx_calendar_events_repeat ON calendar_events(repeat_type, repeat_until);
CREATE INDEX IF NOT EXISTS idx_calendar_events_original ON calendar_events(original_event_id);

-- 更新現有事件為非整天事件
UPDATE calendar_events SET is_all_day = FALSE WHERE is_all_day IS NULL;
```

### 3. 執行 SQL
- 點擊 **Run** 按鈕
- 確認執行成功

### 4. 驗證遷移
執行以下查詢來確認欄位已正確添加：

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'calendar_events' 
ORDER BY ordinal_position;
```

應該會看到新增的欄位：
- `is_all_day` (boolean)
- `repeat_type` (character varying)
- `repeat_until` (date)
- `original_event_id` (integer)

## 遷移完成後
重複事件功能將立即生效！🎉

## 測試步驟
1. 前往 https://120061203.github.io/calendar-todo-app/
2. 點擊 "新增事件"
3. 設定：
   - 標題：測試重複事件
   - 時間：任意時間
   - 重複類型：每月
   - 重複次數：3
4. 點擊新增
5. 檢查是否生成了 3 個月的重複事件
