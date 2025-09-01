const EventService = require('../services/EventService');
const logger = require('../config/logger');

class EventController {
  // 獲取所有事件
  async getAllEvents(req, res) {
    try {
      const events = await EventService.getAllEvents();
      res.json(events);
    } catch (error) {
      logger.error('EventController.getAllEvents error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch events',
        message: error.message 
      });
    }
  }

  // 根據 ID 獲取事件
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ 
          error: 'Event not found',
          message: `Event with id ${id} does not exist`
        });
      }
      
      res.json(event);
    } catch (error) {
      logger.error('EventController.getEventById error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch event',
        message: error.message 
      });
    }
  }

  // 創建事件
  async createEvent(req, res) {
    try {
      const eventData = req.body;
      logger.info('EventController.createEvent received data:', {
        title: eventData.title,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        is_all_day: eventData.is_all_day,
        repeat_type: eventData.repeat_type,
        repeat_until: eventData.repeat_until,
        original_event_id: eventData.original_event_id
      });
      
      const event = await EventService.createEvent(eventData);
      
      logger.info('EventController.createEvent result:', {
        id: event.id,
        title: event.title,
        repeat_type: event.repeat_type,
        repeat_until: event.repeat_until
      });
      
      res.status(201).json(event);
    } catch (error) {
      logger.error('EventController.createEvent error:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation failed',
          message: error.message 
        });
      }
      
      if (error.message.includes('time conflicts')) {
        return res.status(409).json({ 
          error: 'Time conflict',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create event',
        message: error.message 
      });
    }
  }

  // 更新事件
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const event = await EventService.updateEvent(id, updateData);
      
      if (!event) {
        return res.status(404).json({ 
          error: 'Event not found',
          message: `Event with id ${id} does not exist`
        });
      }
      
      res.json(event);
    } catch (error) {
      logger.error('EventController.updateEvent error:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation failed',
          message: error.message 
        });
      }
      
      if (error.message.includes('time conflicts')) {
        return res.status(409).json({ 
          error: 'Time conflict',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to update event',
        message: error.message 
      });
    }
  }

  // 刪除事件
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.deleteEvent(id);
      
      if (!event) {
        return res.status(404).json({ 
          error: 'Event not found',
          message: `Event with id ${id} does not exist`
        });
      }
      
      res.json({ 
        message: 'Event deleted successfully',
        deletedEvent: event 
      });
    } catch (error) {
      logger.error('EventController.deleteEvent error:', error);
      res.status(500).json({ 
        error: 'Failed to delete event',
        message: error.message 
      });
    }
  }

  // 根據日期範圍獲取事件
  async getEventsByDateRange(req, res) {
    try {
      const { start, end } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ 
          error: 'Date range required',
          message: 'Please provide both start and end dates'
        });
      }
      
      const events = await EventService.getEventsByDateRange(start, end);
      res.json(events);
    } catch (error) {
      logger.error('EventController.getEventsByDateRange error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch events by date range',
        message: error.message 
      });
    }
  }

  // 獲取即將到來的事件
  async getUpcomingEvents(req, res) {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit) : 5;
      
      const events = await EventService.getUpcomingEvents(limitNum);
      res.json(events);
    } catch (error) {
      logger.error('EventController.getUpcomingEvents error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch upcoming events',
        message: error.message 
      });
    }
  }

  // 搜索事件
  async searchEvents(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ 
          error: 'Search query required',
          message: 'Please provide a search term'
        });
      }
      
      const events = await EventService.searchEvents(q);
      res.json(events);
    } catch (error) {
      logger.error('EventController.searchEvents error:', error);
      res.status(500).json({ 
        error: 'Failed to search events',
        message: error.message 
      });
    }
  }

  // 獲取事件統計
  async getEventStats(req, res) {
    try {
      const stats = await EventService.getEventStats();
      res.json(stats);
    } catch (error) {
      logger.error('EventController.getEventStats error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch event statistics',
        message: error.message 
      });
    }
  }

  // 檢查事件可用性
  async checkEventAvailability(req, res) {
    try {
      const { start, end } = req.query;
      const { id } = req.params;
      
      if (!start || !end) {
        return res.status(400).json({ 
          error: 'Time range required',
          message: 'Please provide both start and end times'
        });
      }
      
      const excludeId = id !== 'new' ? id : null;
      const availability = await EventService.checkEventAvailability(start, end, excludeId);
      
      res.json(availability);
    } catch (error) {
      logger.error('EventController.checkEventAvailability error:', error);
      res.status(500).json({ 
        error: 'Failed to check event availability',
        message: error.message 
      });
    }
  }
}

module.exports = new EventController();
