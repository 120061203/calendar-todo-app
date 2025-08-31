const { pool } = require('../config/database');
const logger = require('../config/logger');
const Event = require('../models/Event');

class EventRepository {
  // 獲取所有事件
  async findAll() {
    try {
      const query = `
        SELECT * FROM calendar_events 
        ORDER BY start_time ASC
      `;
      const result = await pool.query(query);
      return result.rows.map(row => Event.create(row));
    } catch (error) {
      logger.error('EventRepository.findAll error:', error);
      throw new Error('Failed to fetch events');
    }
  }

  // 根據 ID 獲取事件
  async findById(id) {
    try {
      const query = 'SELECT * FROM calendar_events WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return Event.create(result.rows[0]);
    } catch (error) {
      logger.error('EventRepository.findById error:', error);
      throw new Error('Failed to fetch event');
    }
  }

  // 創建事件
  async create(eventData) {
    try {
      const query = `
        INSERT INTO calendar_events (title, start_time, end_time) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      const values = [eventData.title, eventData.start_time, eventData.end_time];
      const result = await pool.query(query, values);
      
      return Event.create(result.rows[0]);
    } catch (error) {
      logger.error('EventRepository.create error:', error);
      throw new Error('Failed to create event');
    }
  }

  // 更新事件
  async update(id, updateData) {
    try {
      const event = await this.findById(id);
      if (!event) {
        return null;
      }

      event.update(updateData);
      
      const query = `
        UPDATE calendar_events 
        SET title = $1, start_time = $2, end_time = $3, updated_at = NOW()
        WHERE id = $4 
        RETURNING *
      `;
      const values = [event.title, event.start_time, event.end_time, id];
      const result = await pool.query(query, values);
      
      return Event.create(result.rows[0]);
    } catch (error) {
      logger.error('EventRepository.update error:', error);
      throw new Error('Failed to update event');
    }
  }

  // 刪除事件
  async delete(id) {
    try {
      const query = 'DELETE FROM calendar_events WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return Event.create(result.rows[0]);
    } catch (error) {
      logger.error('EventRepository.delete error:', error);
      throw new Error('Failed to delete event');
    }
  }

  // 根據日期範圍獲取事件
  async findByDateRange(startDate, endDate) {
    try {
      const query = `
        SELECT * FROM calendar_events 
        WHERE start_time >= $1 AND end_time <= $2
        ORDER BY start_time ASC
      `;
      const result = await pool.query(query, [startDate, endDate]);
      
      return result.rows.map(row => Event.create(row));
    } catch (error) {
      logger.error('EventRepository.findByDateRange error:', error);
      throw new Error('Failed to fetch events by date range');
    }
  }

  // 檢查時間衝突
  async checkTimeConflict(startTime, endTime, excludeId = null) {
    try {
      let query = `
        SELECT * FROM calendar_events 
        WHERE (start_time < $2 AND end_time > $1)
      `;
      let values = [startTime, endTime];
      
      if (excludeId) {
        query += ' AND id != $3';
        values.push(excludeId);
      }
      
      const result = await pool.query(query, values);
      return result.rows.length > 0;
    } catch (error) {
      logger.error('EventRepository.checkTimeConflict error:', error);
      throw new Error('Failed to check time conflict');
    }
  }

  // 統計事件數量
  async count() {
    try {
      const query = 'SELECT COUNT(*) FROM calendar_events';
      const result = await pool.query(query);
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('EventRepository.count error:', error);
      throw new Error('Failed to count events');
    }
  }

  // 搜索事件
  async search(searchTerm) {
    try {
      const query = `
        SELECT * FROM calendar_events 
        WHERE title ILIKE $1 
        ORDER BY start_time ASC
      `;
      const result = await pool.query(query, [`%${searchTerm}%`]);
      
      return result.rows.map(row => Event.create(row));
    } catch (error) {
      logger.error('EventRepository.search error:', error);
      throw new Error('Failed to search events');
    }
  }

  // 獲取即將到來的事件
  async getUpcomingEvents(limit = 5) {
    try {
      const now = new Date().toISOString();
      const query = `
        SELECT * FROM calendar_events 
        WHERE start_time > $1 
        ORDER BY start_time ASC 
        LIMIT $2
      `;
      const result = await pool.query(query, [now, limit]);
      
      return result.rows.map(row => Event.create(row));
    } catch (error) {
      logger.error('EventRepository.getUpcomingEvents error:', error);
      throw new Error('Failed to fetch upcoming events');
    }
  }
}

module.exports = new EventRepository();
