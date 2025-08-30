const request = require('supertest');
const express = require('express');
const todoRoutes = require('../../routes/todos');

// Mock database
jest.mock('../../db', () => ({
  query: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/todos', todoRoutes);

describe('Todo Routes', () => {
  let mockPool;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool = require('../../db');
  });

  describe('GET /api/todos', () => {
    test('應該返回所有待辦事項', async () => {
      const mockTodos = [
        { id: 1, title: '測試待辦事項1', completed: false },
        { id: 2, title: '測試待辦事項2', completed: true }
      ];

      mockPool.query.mockResolvedValue({ rows: mockTodos });

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toEqual(mockTodos);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM todos ORDER BY created_at DESC');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/todos')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to fetch todos');
    });
  });

  describe('POST /api/todos', () => {
    test('應該創建新的待辦事項', async () => {
      const newTodo = { title: '新待辦事項', due_date: '2024-01-20' };
      const createdTodo = { id: 1, ...newTodo, created_at: '2024-01-15T10:00:00Z' };

      mockPool.query.mockResolvedValue({ rows: [createdTodo] });

      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);

      expect(response.body).toEqual(createdTodo);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO todos (title, due_date) VALUES ($1, $2) RETURNING *',
        [newTodo.title, newTodo.due_date]
      );
    });

    test('缺少標題時應該返回 400 狀態', async () => {
      const invalidTodo = { due_date: '2024-01-20' };

      const response = await request(app)
        .post('/api/todos')
        .send(invalidTodo)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Title is required');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      const newTodo = { title: '新待辦事項' };
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to create todo');
    });
  });

  describe('PUT /api/todos/:id', () => {
    test('應該更新待辦事項的完成狀態', async () => {
      const updateData = { completed: true };
      const updatedTodo = { id: 1, title: '測試待辦事項', completed: true };

      mockPool.query.mockResolvedValue({ rows: [updatedTodo] });

      const response = await request(app)
        .put('/api/todos/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(updatedTodo);
      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
        [true, "1"]
      );
    });

    test('應該更新待辦事項的標題和日期', async () => {
      const updateData = { title: '更新的標題', due_date: '2024-01-25' };
      const updatedTodo = { id: 1, ...updateData, completed: false };

      mockPool.query.mockResolvedValue({ rows: [updatedTodo] });

      const response = await request(app)
        .put('/api/todos/1')
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(updatedTodo);
      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE todos SET title = $1, due_date = $2 WHERE id = $3 RETURNING *',
        [updateData.title, updateData.due_date, "1"]
      );
    });

    test('待辦事項不存在時應該返回 404 狀態', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/todos/999')
        .send({ title: '更新的標題' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Todo not found');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/todos/1')
        .send({ title: '更新的標題' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to update todo');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    test('應該刪除指定的待辦事項', async () => {
      mockPool.query.mockResolvedValue({ rows: [{ id: 1, title: '已刪除的待辦事項' }] });

      const response = await request(app)
        .delete('/api/todos/1')
        .expect(200);

      expect(response.body).toEqual({ message: "Todo deleted successfully" });
      expect(mockPool.query).toHaveBeenCalledWith(
        'DELETE FROM todos WHERE id = $1 RETURNING *',
        ["1"]
      );
    });

    test('待辦事項不存在時應該返回 404 狀態', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete('/api/todos/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Todo not found');
    });

    test('資料庫錯誤時應該返回 500 狀態', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/todos/1')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to delete todo');
    });
  });
});
