-- 添加行事曆增強功能
-- 1. 整天事件選項
-- 2. 重複事件選項
-- 3. 拖曳移動功能支持

-- 添加新欄位到 calendar_events 表
ALTER TABLE calendar_events 
ADD COLUMN is_all_day BOOLEAN DEFAULT FALSE,
ADD COLUMN repeat_type VARCHAR(20) DEFAULT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
ADD COLUMN repeat_until DATE DEFAULT NULL,
ADD COLUMN original_event_id INTEGER DEFAULT NULL; -- 用於重複事件的關聯

-- 創建索引以提高查詢性能
CREATE INDEX idx_calendar_events_all_day ON calendar_events(is_all_day);
CREATE INDEX idx_calendar_events_repeat ON calendar_events(repeat_type, repeat_until);
CREATE INDEX idx_calendar_events_original ON calendar_events(original_event_id);

-- 更新現有事件為非整天事件
UPDATE calendar_events SET is_all_day = FALSE WHERE is_all_day IS NULL;
