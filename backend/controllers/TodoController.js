const TodoService = require('../services/TodoService');
const logger = require('../config/logger');

class TodoController {
  // 獲取所有待辦事項
  async getAllTodos(req, res) {
    try {
      const todos = await TodoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      logger.error('TodoController.getAllTodos error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch todos',
        message: error.message 
      });
    }
  }

  // 根據 ID 獲取待辦事項
  async getTodoById(req, res) {
    try {
      const { id } = req.params;
      const todo = await TodoService.getTodoById(id);
      
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with id ${id} does not exist`
        });
      }
      
      res.json(todo);
    } catch (error) {
      logger.error('TodoController.getTodoById error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch todo',
        message: error.message 
      });
    }
  }

  // 創建待辦事項
  async createTodo(req, res) {
    try {
      const todoData = req.body;
      const todo = await TodoService.createTodo(todoData);
      
      res.status(201).json(todo);
    } catch (error) {
      logger.error('TodoController.createTodo error:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation failed',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create todo',
        message: error.message 
      });
    }
  }

  // 更新待辦事項
  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const todo = await TodoService.updateTodo(id, updateData);
      
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with id ${id} does not exist`
        });
      }
      
      res.json(todo);
    } catch (error) {
      logger.error('TodoController.updateTodo error:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation failed',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to update todo',
        message: error.message 
      });
    }
  }

  // 刪除待辦事項
  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const todo = await TodoService.deleteTodo(id);
      
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with id ${id} does not exist`
        });
      }
      
      res.json({ 
        message: 'Todo deleted successfully',
        deletedTodo: todo 
      });
    } catch (error) {
      logger.error('TodoController.deleteTodo error:', error);
      res.status(500).json({ 
        error: 'Failed to delete todo',
        message: error.message 
      });
    }
  }

  // 批量刪除已完成的待辦事項
  async deleteCompletedTodos(req, res) {
    try {
      const deletedTodos = await TodoService.deleteCompletedTodos();
      
      res.json({ 
        message: `Successfully deleted ${deletedTodos.length} completed todos`,
        deletedTodos 
      });
    } catch (error) {
      logger.error('TodoController.deleteCompletedTodos error:', error);
      res.status(500).json({ 
        error: 'Failed to delete completed todos',
        message: error.message 
      });
    }
  }

  // 切換待辦事項完成狀態
  async toggleTodoStatus(req, res) {
    try {
      const { id } = req.params;
      const todo = await TodoService.toggleTodoStatus(id);
      
      if (!todo) {
        return res.status(404).json({ 
          error: 'Todo not found',
          message: `Todo with id ${id} does not exist`
        });
      }
      
      res.json(todo);
    } catch (error) {
      logger.error('TodoController.toggleTodoStatus error:', error);
      res.status(500).json({ 
        error: 'Failed to toggle todo status',
        message: error.message 
      });
    }
  }

  // 根據狀態獲取待辦事項
  async getTodosByStatus(req, res) {
    try {
      const { status } = req.params;
      const completed = status === 'completed';
      const todos = await TodoService.getTodosByStatus(completed);
      
      res.json(todos);
    } catch (error) {
      logger.error('TodoController.getTodosByStatus error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch todos by status',
        message: error.message 
      });
    }
  }

  // 搜索待辦事項
  async searchTodos(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ 
          error: 'Search query required',
          message: 'Please provide a search term'
        });
      }
      
      const todos = await TodoService.searchTodos(q);
      res.json(todos);
    } catch (error) {
      logger.error('TodoController.searchTodos error:', error);
      res.status(500).json({ 
        error: 'Failed to search todos',
        message: error.message 
      });
    }
  }

  // 獲取待辦事項統計
  async getTodoStats(req, res) {
    try {
      const stats = await TodoService.getTodoStats();
      res.json(stats);
    } catch (error) {
      logger.error('TodoController.getTodoStats error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch todo statistics',
        message: error.message 
      });
    }
  }
}

module.exports = new TodoController();
