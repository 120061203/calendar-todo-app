const request = require('supertest');
const express = require('express');
const eventRoutes = require('../../routes/events');

// Mock database
jest.mock('../../db', () => ({
  query: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/events', eventRoutes);

describe('Event Routes', () => {
  let mockPool;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool = require('../../db');
  });

  describe('GET /api/events', () => {
    test('應該返回所有事件', async () => {
      const mockEvents = [
        { id: 1, title: '測試事件1', start_time: '2024-01-20T10:00:00Z', end_time: '2024-01-20T11:00:00Z' },
        { id: 2, title: '測試事件2', start_time: '2024-01-21T10:00:00Z', end_time: '2024-01-21T11:00:00Z' }
      ];

      mockPool.query.mockResolvedValue({ rows: mockEvents });

      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toEqual(mockEvents);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM calendar_events ORDER BY start_time ASC');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/events')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to fetch events');
    });
  });

  describe('POST /api/events', () => {
    test('應該創建新的事件', async () => {
      const newEvent = { 
        title: '新事件', 
        start_time: '2024-01-20T10:00:00Z', 
        end_time: '2024-01-20T11:00:00Z' 
      };
      const createdEvent = { id: 1, ...newEvent, created_at: '2024-01-15T10:00:00Z' };

      mockPool.query.mockResolvedValue({ rows: [createdEvent] });

      const response = await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(201);

      expect(response.body).toEqual(createdEvent);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO calendar_events (title, start_time, end_time) VALUES ($1, $2, $3) RETURNING *',
        [newEvent.title, newEvent.start_time, newEvent.end_time]
      );
    });

    test('缺少標題時應該返回 400 狀態', async () => {
      const invalidEvent = { 
        start_time: '2024-01-20T10:00:00Z', 
        end_time: '2024-01-20T11:00:00Z' 
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Title is required');
    });

    test('缺少開始時間時應該返回 400 狀態', async () => {
      const invalidEvent = { 
        title: '測試事件',
        end_time: '2024-01-20T11:00:00Z' 
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Start time is required');
    });

    test('缺少結束時間時應該返回 400 狀態', async () => {
      const invalidEvent = { 
        title: '測試事件',
        start_time: '2024-01-20T10:00:00Z'
      };

      const response = await request(app)
        .post('/api/events')
        .send(invalidEvent)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('End time is required');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      const newEvent = { 
        title: '新事件', 
        start_time: '2024-01-20T10:00:00Z', 
        end_time: '2024-01-20T11:00:00Z' 
      };
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/events')
        .send(newEvent)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to create event');
    });
  });

  describe('PUT /api/events/:id', () => {
    test('應該更新事件', async () => {
      const updateData = { 
        title: '更新的事件', 
        start_time: '2024-01-20T11:00:00Z', 
        end_time: '2024-01-20T12:00:00Z' 
      };
      const updatedEvent = { id: 1, ...updateData, created_at: '2024-01-15T10:00:00Z' };

      mockPool.query.mockResolvedValue({ rows: [updatedEvent] });

      const response = await request(app)
        .put('/api/events/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(updatedEvent);
      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE calendar_events SET title = $1, start_time = $2, end_time = $3 WHERE id = $4 RETURNING *',
        [updateData.title, updateData.start_time, updateData.end_time, 1]
      );
    });

    test('事件不存在時應該返回 404 狀態', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/events/999')
        .send({ title: '更新的事件' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Event not found');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/events/1')
        .send({ title: '更新的事件' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to update event');
    });
  });

  describe('DELETE /api/events/:id', () => {
    test('應該刪除指定的事件', async () => {
      const deletedEvent = { id: 1, title: '已刪除的事件' };
      mockPool.query.mockResolvedValue({ rows: [deletedEvent] });

      const response = await request(app)
        .delete('/api/events/1')
        .expect(200);

      expect(response.body).toEqual(deletedEvent);
      expect(mockPool.query).toHaveBeenCalledWith(
        'DELETE FROM calendar_events WHERE id = $1 RETURNING *',
        [1]
      );
    });

    test('事件不存在時應該返回 404 狀態', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete('/api/events/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Event not found');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/events/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to delete event');
    });
  });
});
