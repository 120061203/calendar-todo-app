const TodoRepository = require('../repositories/TodoRepository');
const logger = require('../config/logger');
const Todo = require('../models/Todo');

class TodoService {
  // 獲取所有待辦事項
  async getAllTodos() {
    try {
      logger.info('Fetching all todos');
      const todos = await TodoRepository.findAll();
      logger.info(`Successfully fetched ${todos.length} todos`);
      return todos;
    } catch (error) {
      logger.error('TodoService.getAllTodos error:', error);
      throw error;
    }
  }

  // 根據 ID 獲取待辦事項
  async getTodoById(id) {
    try {
      logger.info(`Fetching todo with id: ${id}`);
      const todo = await TodoRepository.findById(id);
      
      if (!todo) {
        logger.warn(`Todo with id ${id} not found`);
        return null;
      }
      
      logger.info(`Successfully fetched todo: ${todo.title}`);
      return todo;
    } catch (error) {
      logger.error(`TodoService.getTodoById error for id ${id}:`, error);
      throw error;
    }
  }

  // 創建待辦事項
  async createTodo(todoData) {
    try {
      logger.info('Creating new todo:', { title: todoData.title });
      
      // 驗證數據
      const todo = Todo.create(todoData);
      const validation = todo.validateInstance();
      
      if (!validation.isValid) {
        logger.warn('Todo validation failed:', validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const createdTodo = await TodoRepository.create(todoData);
      logger.info(`Successfully created todo with id: ${createdTodo.id}`);
      
      return createdTodo;
    } catch (error) {
      logger.error('TodoService.createTodo error:', error);
      throw error;
    }
  }

  // 更新待辦事項
  async updateTodo(id, updateData) {
    try {
      logger.info(`Updating todo with id: ${id}`, updateData);
      
      // 檢查待辦事項是否存在
      const existingTodo = await TodoRepository.findById(id);
      if (!existingTodo) {
        logger.warn(`Todo with id ${id} not found for update`);
        return null;
      }
      
      // 驗證更新數據
      const todo = Todo.create({ ...existingTodo.toJSON(), ...updateData });
      const validation = todo.validateInstance();
      
      if (!validation.isValid) {
        logger.warn('Todo update validation failed:', validation.errors);
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      const updatedTodo = await TodoRepository.update(id, updateData);
      logger.info(`Successfully updated todo with id: ${id}`);
      
      return updatedTodo;
    } catch (error) {
      logger.error(`TodoService.updateTodo error for id ${id}:`, error);
      throw error;
    }
  }

  // 刪除待辦事項
  async deleteTodo(id) {
    try {
      logger.info(`Deleting todo with id: ${id}`);
      
      const deletedTodo = await TodoRepository.delete(id);
      if (!deletedTodo) {
        logger.warn(`Todo with id ${id} not found for deletion`);
        return null;
      }
      
      logger.info(`Successfully deleted todo with id: ${id}`);
      return deletedTodo;
    } catch (error) {
      logger.error(`TodoService.deleteTodo error for id ${id}:`, error);
      throw error;
    }
  }

  // 批量刪除已完成的待辦事項
  async deleteCompletedTodos() {
    try {
      logger.info('Deleting all completed todos');
      
      const deletedTodos = await TodoRepository.deleteCompleted();
      logger.info(`Successfully deleted ${deletedTodos.length} completed todos`);
      
      return deletedTodos;
    } catch (error) {
      logger.error('TodoService.deleteCompletedTodos error:', error);
      throw error;
    }
  }

  // 切換待辦事項完成狀態
  async toggleTodoStatus(id) {
    try {
      logger.info(`Toggling completion status for todo with id: ${id}`);
      
      const todo = await TodoRepository.findById(id);
      if (!todo) {
        logger.warn(`Todo with id ${id} not found for status toggle`);
        return null;
      }
      
      const newStatus = !todo.completed;
      const updatedTodo = await TodoRepository.update(id, { completed: newStatus });
      
      logger.info(`Successfully toggled todo status to ${newStatus} for id: ${id}`);
      return updatedTodo;
    } catch (error) {
      logger.error(`TodoService.toggleTodoStatus error for id ${id}:`, error);
      throw error;
    }
  }

  // 根據狀態獲取待辦事項
  async getTodosByStatus(completed) {
    try {
      logger.info(`Fetching todos with status: ${completed}`);
      
      const todos = await TodoRepository.findByStatus(completed);
      logger.info(`Successfully fetched ${todos.length} todos with status ${completed}`);
      
      return todos;
    } catch (error) {
      logger.error(`TodoService.getTodosByStatus error for status ${completed}:`, error);
      throw error;
    }
  }

  // 搜索待辦事項
  async searchTodos(searchTerm) {
    try {
      logger.info(`Searching todos with term: ${searchTerm}`);
      
      if (!searchTerm || searchTerm.trim().length === 0) {
        logger.warn('Empty search term provided');
        return [];
      }
      
      const todos = await TodoRepository.search(searchTerm.trim());
      logger.info(`Found ${todos.length} todos matching search term: ${searchTerm}`);
      
      return todos;
    } catch (error) {
      logger.error(`TodoService.searchTodos error for term ${searchTerm}:`, error);
      throw error;
    }
  }

  // 獲取待辦事項統計
  async getTodoStats() {
    try {
      logger.info('Fetching todo statistics');
      
      const [total, completed, pending] = await Promise.all([
        TodoRepository.count(),
        TodoRepository.findByStatus(true),
        TodoRepository.findByStatus(false)
      ]);
      
      const stats = {
        total,
        completed: completed.length,
        pending: pending.length,
        completionRate: total > 0 ? Math.round((completed.length / total) * 100) : 0
      };
      
      logger.info('Successfully fetched todo statistics:', stats);
      return stats;
    } catch (error) {
      logger.error('TodoService.getTodoStats error:', error);
      throw error;
    }
  }
}

module.exports = new TodoService();
