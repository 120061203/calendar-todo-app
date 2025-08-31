const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

class Event {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // 靜態驗證規則
  static getValidationRules() {
    return [
      body('title')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('標題必須在 1-255 字符之間')
        .escape(),
      body('start_time')
        .isISO8601()
        .withMessage('開始時間必須是有效的 ISO 8601 格式'),
      body('end_time')
        .isISO8601()
        .withMessage('結束時間必須是有效的 ISO 8601 格式')
        .custom((value, { req }) => {
          if (new Date(value) <= new Date(req.body.start_time)) {
            throw new Error('結束時間必須晚於開始時間');
          }
          return true;
        })
    ];
  }

  // 驗證數據
  static validate(data) {
    const errors = validationResult(data);
    if (!errors.isEmpty()) {
      return {
        isValid: false,
        errors: errors.array()
      };
    }
    return { isValid: true };
  }

  // 創建 Event 實例
  static create(data) {
    return new Event(data);
  }

  // 轉換為普通對象
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      start_time: this.start_time,
      end_time: this.end_time,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // 驗證實例數據
  validateInstance() {
    const errors = [];
    
    if (!this.title || this.title.trim().length === 0) {
      errors.push('標題不能為空');
    }
    
    if (this.title && this.title.length > 255) {
      errors.push('標題不能超過 255 字符');
    }
    
    if (!this.start_time || !this.isValidDate(this.start_time)) {
      errors.push('開始時間無效');
    }
    
    if (!this.end_time || !this.isValidDate(this.end_time)) {
      errors.push('結束時間無效');
    }
    
    if (this.start_time && this.end_time) {
      if (new Date(this.end_time) <= new Date(this.start_time)) {
        errors.push('結束時間必須晚於開始時間');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 檢查日期有效性
  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  // 更新數據
  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.start_time !== undefined) this.start_time = data.start_time;
    if (data.end_time !== undefined) this.end_time = data.end_time;
    this.updated_at = new Date();
  }

  // 獲取事件持續時間（分鐘）
  getDuration() {
    if (!this.start_time || !this.end_time) return 0;
    const start = new Date(this.start_time);
    const end = new Date(this.end_time);
    return Math.round((end - start) / (1000 * 60));
  }

  // 檢查事件是否衝突
  hasConflict(otherEvent) {
    if (!otherEvent || !otherEvent.start_time || !otherEvent.end_time) return false;
    
    const thisStart = new Date(this.start_time);
    const thisEnd = new Date(this.end_time);
    const otherStart = new Date(otherEvent.start_time);
    const otherEnd = new Date(otherEvent.end_time);
    
    return thisStart < otherEnd && thisEnd > otherStart;
  }
}

module.exports = Event;
