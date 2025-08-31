const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

class Todo {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.due_date = data.due_date;
    this.completed = data.completed || false;
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
      body('due_date')
        .optional()
        .isISO8601()
        .withMessage('日期格式必須是有效的 ISO 8601 格式'),
      body('completed')
        .optional()
        .isBoolean()
        .withMessage('完成狀態必須是布林值')
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

  // 創建 Todo 實例
  static create(data) {
    return new Todo(data);
  }

  // 轉換為普通對象
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      due_date: this.due_date,
      completed: this.completed,
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
    
    if (this.due_date && !this.isValidDate(this.due_date)) {
      errors.push('日期格式無效');
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
    if (data.due_date !== undefined) this.due_date = data.due_date;
    if (data.completed !== undefined) this.completed = data.completed;
    this.updated_at = new Date();
  }
}

module.exports = Todo;
