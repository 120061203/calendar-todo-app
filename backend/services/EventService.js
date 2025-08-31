const EventRepository = require('../repositories/EventRepository');
const logger = require('../config/logger');
const Event = require('../models/Event');

class EventService {
  // 獲取所有事件
  async getAllEvents() {
    try {
      logger.info('Fetching all events');
      const events = await EventRepository.findAll();
      logger.info(`Successfully fetched ${events.length} events`);
      return events;
    } catch (error) {
      logger.error('EventService.getAllEvents error:', error);
      throw error;
    }
  }

  // 根據 ID 獲取事件
  async getEventById(id) {
    try {
      logger.info(`Fetching event with id: ${id}`);
      const event = await EventRepository.findById(id);
      
      if (!event) {
        logger.warn(`Event with id ${id} not found`);
        return null;
      }
      
      logger.info(`Successfully fetched event: ${event.title}`);
      return event;
    } catch (error) {
      logger.error(`EventService.getEventById error for id ${id}:`, error);
      throw error;
    }
  }

  // 創建事件
  async createEvent(eventData) {
    try {
      logger.info('Creating new event:', { title: eventData.title });
      
      // 驗證數據
      const event = Event.create(eventData);
      const validation = event.validateInstance();
      
      if (!validation.isValid) {
        logger.warn('Event validation failed:', validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // 檢查時間衝突
      const hasConflict = await EventRepository.checkTimeConflict(
        eventData.start_time, 
        eventData.end_time
      );
      
      if (hasConflict) {
        logger.warn('Time conflict detected for new event');
        throw new Error('Event time conflicts with existing events');
      }
      
      const createdEvent = await EventRepository.create(eventData);
      logger.info(`Successfully created event with id: ${createdEvent.id}`);
      
      return createdEvent;
    } catch (error) {
      logger.error('EventService.createEvent error:', error);
      throw error;
    }
  }

  // 更新事件
  async updateEvent(id, updateData) {
    try {
      logger.info(`Updating event with id: ${id}`, updateData);
      
      // 檢查事件是否存在
      const existingEvent = await EventRepository.findById(id);
      if (!existingEvent) {
        logger.warn(`Event with id ${id} not found for update`);
        return null;
      }
      
      // 驗證更新數據
      const event = Event.create({ ...existingEvent.toJSON(), ...updateData });
      const validation = event.validateInstance();
      
      if (!validation.isValid) {
        logger.warn('Event update validation failed:', validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // 檢查時間衝突（排除當前事件）
      if (updateData.start_time || updateData.end_time) {
        const startTime = updateData.start_time || existingEvent.start_time;
        const endTime = updateData.end_time || existingEvent.end_time;
        
        const hasConflict = await EventRepository.checkTimeConflict(
          startTime, 
          endTime, 
          id
        );
        
        if (hasConflict) {
          logger.warn('Time conflict detected for event update');
          throw new Error('Updated event time conflicts with existing events');
        }
      }
      
      const updatedEvent = await EventRepository.update(id, updateData);
      logger.info(`Successfully updated event with id: ${id}`);
      
      return updatedEvent;
    } catch (error) {
      logger.error(`EventService.updateEvent error for id ${id}:`, error);
      throw error;
    }
  }

  // 刪除事件
  async deleteEvent(id) {
    try {
      logger.info(`Deleting event with id: ${id}`);
      
      const deletedEvent = await EventRepository.delete(id);
      if (!deletedEvent) {
        logger.warn(`Event with id ${id} not found for deletion`);
        return null;
      }
      
      logger.info(`Successfully deleted event with id: ${id}`);
      return deletedEvent;
    } catch (error) {
      logger.error(`EventService.deleteEvent error for id ${id}:`, error);
      throw error;
    }
  }

  // 根據日期範圍獲取事件
  async getEventsByDateRange(startDate, endDate) {
    try {
      logger.info(`Fetching events from ${startDate} to ${endDate}`);
      
      const events = await EventRepository.findByDateRange(startDate, endDate);
      logger.info(`Successfully fetched ${events.length} events in date range`);
      
      return events;
    } catch (error) {
      logger.error(`EventService.getEventsByDateRange error:`, error);
      throw error;
    }
  }

  // 獲取即將到來的事件
  async getUpcomingEvents(limit = 5) {
    try {
      logger.info(`Fetching ${limit} upcoming events`);
      
      const events = await EventRepository.getUpcomingEvents(limit);
      logger.info(`Successfully fetched ${events.length} upcoming events`);
      
      return events;
    } catch (error) {
      logger.error('EventService.getUpcomingEvents error:', error);
      throw error;
    }
  }

  // 搜索事件
  async searchEvents(searchTerm) {
    try {
      logger.info(`Searching events with term: ${searchTerm}`);
      
      if (!searchTerm || searchTerm.trim().length === 0) {
        logger.warn('Empty search term provided');
        return [];
      }
      
      const events = await EventRepository.search(searchTerm.trim());
      logger.info(`Found ${events.length} events matching search term: ${searchTerm}`);
      
      return events;
    } catch (error) {
      logger.error(`EventService.searchEvents error for term ${searchTerm}:`, error);
      throw error;
    }
  }

  // 獲取事件統計
  async getEventStats() {
    try {
      logger.info('Fetching event statistics');
      
      const [total, upcoming] = await Promise.all([
        EventRepository.count(),
        EventRepository.getUpcomingEvents(10)
      ]);
      
      const now = new Date();
      const todayEvents = upcoming.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === now.toDateString();
      });
      
      const stats = {
        total,
        upcoming: upcoming.length,
        today: todayEvents.length,
        nextEvent: upcoming.length > 0 ? upcoming[0] : null
      };
      
      logger.info('Successfully fetched event statistics:', stats);
      return stats;
    } catch (error) {
      logger.error('EventService.getEventStats error:', error);
      throw error;
    }
  }

  // 檢查事件可用性
  async checkEventAvailability(startTime, endTime, excludeId = null) {
    try {
      logger.info(`Checking event availability from ${startTime} to ${endTime}`);
      
      const hasConflict = await EventRepository.checkTimeConflict(
        startTime, 
        endTime, 
        excludeId
      );
      
      const isAvailable = !hasConflict;
      logger.info(`Event availability check result: ${isAvailable}`);
      
      return {
        isAvailable,
        hasConflict
      };
    } catch (error) {
      logger.error('EventService.checkEventAvailability error:', error);
      throw error;
    }
  }
}

module.exports = new EventService();
