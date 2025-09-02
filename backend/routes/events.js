const express = require('express');
const { validationResult } = require('express-validator');
const EventController = require('../controllers/EventController');
const Event = require('../models/Event');
const router = express.Router();

// 驗證錯誤處理中間件
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// 獲取所有事件
router.get('/', EventController.getAllEvents.bind(EventController));

// 創建事件
router.post('/', Event.getValidationRules(), handleValidationErrors, EventController.createEvent.bind(EventController));

// 根據日期範圍獲取事件 (必須在 /:id 之前)
router.get('/range', EventController.getEventsByDateRange.bind(EventController));

// 獲取即將到來的事件 (必須在 /:id 之前)
router.get('/upcoming', EventController.getUpcomingEvents.bind(EventController));

// 搜索事件 (必須在 /:id 之前)
router.get('/search', EventController.searchEvents.bind(EventController));

// 獲取事件統計 (必須在 /:id 之前)
router.get('/stats', EventController.getEventStats.bind(EventController));

// 獲取特定事件
router.get('/:id', EventController.getEventById.bind(EventController));

// 更新事件
router.put('/:id', Event.getValidationRules(), handleValidationErrors, EventController.updateEvent.bind(EventController));

// 刪除事件
router.delete('/:id', EventController.deleteEvent.bind(EventController));

// 檢查事件可用性
router.get('/:id/availability', EventController.checkEventAvailability.bind(EventController));

module.exports = router;
