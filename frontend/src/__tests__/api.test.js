import axios from 'axios';
import * as api from '../api';

// Mock axios
jest.mock('axios');

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Todo API', () => {
    test('getTodos 應該調用正確的 API 端點', async () => {
      const mockResponse = { data: [] };
      axios.get.mockResolvedValue(mockResponse);

      await api.getTodos();

      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/todos');
    });

    test('addTodo 應該發送 POST 請求到正確的端點', async () => {
      const mockResponse = { data: { id: 1, title: '新待辦事項' } };
      axios.post.mockResolvedValue(mockResponse);

      const newTodo = { title: '新待辦事項', due_date: '2024-01-20' };
      await api.addTodo(newTodo);

      expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/todos', newTodo);
    });

    test('updateTodo 應該發送 PUT 請求到正確的端點', async () => {
      const mockResponse = { data: { id: 1, title: '更新的待辦事項' } };
      axios.put.mockResolvedValue(mockResponse);

      const updateData = { title: '更新的待辦事項', completed: true };
      await api.updateTodo(1, updateData);

      expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/api/todos/1', updateData);
    });

    test('deleteTodo 應該發送 DELETE 請求到正確的端點', async () => {
      const mockResponse = { data: { message: '刪除成功' } };
      axios.delete.mockResolvedValue(mockResponse);

      await api.deleteTodo(1);

      expect(axios.delete).toHaveBeenCalledWith('http://localhost:4000/api/todos/1');
    });
  });

  describe('Event API', () => {
    test('getEvents 應該調用正確的 API 端點', async () => {
      const mockResponse = { data: [] };
      axios.get.mockResolvedValue(mockResponse);

      await api.getEvents();

      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/events');
    });

    test('addEvent 應該發送 POST 請求到正確的端點', async () => {
      const mockResponse = { data: { id: 1, title: '新事件' } };
      axios.post.mockResolvedValue(mockResponse);

      const newEvent = { 
        title: '新事件', 
        start_time: '2024-01-20T10:00:00Z', 
        end_time: '2024-01-20T11:00:00Z' 
      };
      await api.addEvent(newEvent);

      expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/events', newEvent);
    });

    test('updateEvent 應該發送 PUT 請求到正確的端點', async () => {
      const mockResponse = { data: { id: 1, title: '更新的事件' } };
      axios.put.mockResolvedValue(mockResponse);

      const updateData = { 
        title: '更新的事件', 
        start_time: '2024-01-20T10:00:00Z', 
        end_time: '2024-01-20T11:00:00Z' 
      };
      await api.updateEvent(1, updateData);

      expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/api/events/1', updateData);
    });

    test('deleteEvent 應該發送 DELETE 請求到正確的端點', async () => {
      const mockResponse = { data: { message: '刪除成功' } };
      axios.delete.mockResolvedValue(mockResponse);

      await api.deleteEvent(1);

      expect(axios.delete).toHaveBeenCalledWith('http://localhost:4000/api/events/1');
    });
  });

  describe('Error Handling', () => {
    test('API 錯誤應該被正確拋出', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(api.getTodos()).rejects.toThrow(errorMessage);
    });

    test('HTTP 錯誤狀態應該被正確處理', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { error: 'Internal Server Error' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(api.addTodo({ title: '測試' })).rejects.toEqual(errorResponse);
    });
  });

  describe('Request/Response Data', () => {
    test('應該正確處理複雜的待辦事項數據', async () => {
      const mockResponse = { 
        data: { 
          id: 1, 
          title: '複雜待辦事項', 
          due_date: '2024-01-20',
          completed: false,
          created_at: '2024-01-15T10:00:00Z'
        } 
      };
      axios.post.mockResolvedValue(mockResponse);

      const complexTodo = {
        title: '複雜待辦事項',
        due_date: '2024-01-20'
      };

      const result = await api.addTodo(complexTodo);
      expect(result.data).toEqual(mockResponse.data);
    });

    test('應該正確處理複雜的事件數據', async () => {
      const mockResponse = { 
        data: { 
          id: 1, 
          title: '複雜事件', 
          start_time: '2024-01-20T10:00:00Z',
          end_time: '2024-01-20T11:00:00Z',
          created_at: '2024-01-15T10:00:00Z'
        } 
      };
      axios.post.mockResolvedValue(mockResponse);

      const complexEvent = {
        title: '複雜事件',
        start_time: '2024-01-20T10:00:00Z',
        end_time: '2024-01-20T11:00:00Z'
      };

      const result = await api.addEvent(complexEvent);
      expect(result.data).toEqual(mockResponse.data);
    });
  });

  describe('API URL Configuration', () => {
    test('應該使用正確的基礎 URL', () => {
      // 檢查 API 模組是否導出了正確的基礎 URL
      expect(api.API_URL).toBe('http://localhost:4000/api');
    });

    test('所有端點都應該使用正確的基礎 URL', async () => {
      const mockResponse = { data: [] };
      axios.get.mockResolvedValue(mockResponse);
      axios.post.mockResolvedValue(mockResponse);

      await api.getTodos();
      await api.addTodo({ title: '測試' });

      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/todos');
      expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/todos', { title: '測試' });
    });
  });
});
