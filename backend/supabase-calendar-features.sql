-- Supabase 專用：添加行事曆增強功能
-- 注意：Supabase 使用不同的權限結構

-- 添加新欄位到 calendar_events 表
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
