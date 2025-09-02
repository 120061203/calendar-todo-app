const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

class Event {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.is_all_day = data.is_all_day || false;
    this.repeat_type = data.repeat_type !== undefined ? data.repeat_type : null;
    this.repeat_until = data.repeat_until !== undefined ? data.repeat_until : null;
    this.original_event_id = data.original_event_id !== undefined ? data.original_event_id : null;
  }

  static create(data) {
    return new Event(data);
  }

  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.start_time !== undefined) this.start_time = data.start_time;
    if (data.end_time !== undefined) this.end_time = data.end_time;
    if (data.is_all_day !== undefined) this.is_all_day = data.is_all_day;
    if (data.repeat_type !== undefined) this.repeat_type = data.repeat_type;
    if (data.repeat_until !== undefined) this.repeat_until = data.repeat_until;
    if (data.original_event_id !== undefined) this.original_event_id = data.original_event_id;
    this.updated_at = new Date();
  }

  validateInstance() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!this.is_all_day) {
      if (!this.start_time) {
        errors.push('Start time is required for non-all-day events');
      }
      if (!this.end_time) {
        errors.push('End time is required for non-all-day events');
      }
      if (this.start_time && this.end_time && new Date(this.start_time) >= new Date(this.end_time)) {
        errors.push('End time must be after start time');
      }
    } else {
      // 整天事件只需要日期，時間會被忽略
      if (!this.start_time) {
        errors.push('Start date is required for all-day events');
      }
    }

    if (this.repeat_type && !['daily', 'weekly', 'monthly', 'yearly'].includes(this.repeat_type)) {
      errors.push('Invalid repeat type');
    }

    if (this.repeat_type && this.repeat_until && new Date(this.repeat_until) < new Date(this.start_time)) {
      errors.push('Repeat until date must be after start date');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      start_time: this.start_time,
      end_time: this.end_time,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_all_day: this.is_all_day,
      repeat_type: this.repeat_type,
      repeat_until: this.repeat_until,
      original_event_id: this.original_event_id
    };
  }

  static getValidationRules() {
    return [
      body('title').notEmpty().withMessage('Title is required'),
      body('start_time').notEmpty().withMessage('Start time is required'),
      body('end_time').notEmpty().withMessage('End time is required'),
      body('is_all_day').optional().isBoolean().withMessage('is_all_day must be boolean'),
      body('repeat_type').optional().custom((value) => {
        if (value === null || value === undefined || value === '') return true;
        return ['daily', 'weekly', 'monthly', 'yearly'].includes(value);
      }).withMessage('Invalid repeat type'),
      body('repeat_until').optional().custom((value) => {
        if (value === null || value === undefined || value === '') return true;
        return !isNaN(Date.parse(value));
      }).withMessage('repeat_until must be a valid date'),
      body('original_event_id').optional().custom((value) => {
        if (value === null || value === undefined || value === '') return true;
        return Number.isInteger(Number(value));
      }).withMessage('original_event_id must be an integer')
    ];
  }
}

module.exports = Event;
