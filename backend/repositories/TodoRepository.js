const pool = require('../config/db');
const logger = require('../config/logger');
const Todo = require('../models/Todo');

class TodoRepository {
  // 獲取所有待辦事項
  async findAll() {
    try {
      const query = `
        SELECT * FROM todos 
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query);
      
      console.log('🔍 資料庫查詢結果:', result.rows.length, '行');
      
      // 修復：確保資料格式正確
      const todos = result.rows.map((row, index) => {
        try {
          console.log(`🔍 處理第 ${index + 1} 行:`, row);
          
          // 處理日期格式
          const todoData = {
            ...row,
            created_at: row.created_at ? new Date(row.created_at) : new Date(),
            updated_at: row.updated_at ? new Date(row.updated_at) : new Date()
          };
          
          console.log(`🔍 處理後的數據:`, todoData);
          
          const todo = Todo.create(todoData);
          console.log(`✅ 第 ${index + 1} 行 Todo 創建成功`);
          return todo;
        } catch (rowError) {
          console.error(`❌ 處理第 ${index + 1} 行時出錯:`, rowError);
          throw rowError;
        }
      });
      
      console.log(`✅ 成功創建 ${todos.length} 個 Todo 對象`);
      return todos;
    } catch (error) {
      console.error('❌ TodoRepository.findAll 詳細錯誤:', error);
      logger.error('TodoRepository.findAll error:', error);
      throw new Error('Failed to fetch todos');
    }
  }

  // 根據 ID 獲取待辦事項
  async findById(id) {
    try {
      const query = 'SELECT * FROM todos WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return Todo.create(result.rows[0]);
    } catch (error) {
      logger.error('TodoRepository.findById error:', error);
      throw new Error('Failed to fetch todo');
    }
  }

  // 創建待辦事項
  async create(todoData) {
    try {
      const query = `
        INSERT INTO todos (title, due_date, completed) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      const values = [todoData.title, todoData.due_date, todoData.completed || false];
      const result = await pool.query(query, values);
      
      return Todo.create(result.rows[0]);
    } catch (error) {
      logger.error('TodoRepository.create error:', error);
      throw new Error('Failed to create todo');
    }
  }

  // 更新待辦事項
  async update(id, updateData) {
    try {
      const todo = await this.findById(id);
      if (!todo) {
        return null;
      }

      todo.update(updateData);
      
      const query = `
        UPDATE todos 
        SET title = $1, due_date = $2, completed = $3, updated_at = NOW()
        WHERE id = $4 
        RETURNING *
      `;
      const values = [todo.title, todo.due_date, todo.completed, id];
      const result = await pool.query(query, values);
      
      return Todo.create(result.rows[0]);
    } catch (error) {
      logger.error('TodoRepository.update error:', error);
      throw new Error('Failed to update todo');
    }
  }

  // 刪除待辦事項
  async delete(id) {
    try {
      const query = 'DELETE FROM todos WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return Todo.create(result.rows[0]);
    } catch (error) {
      logger.error('TodoRepository.delete error:', error);
      throw new Error('Failed to delete todo');
    }
  }

  // 批量刪除已完成的待辦事項
  async deleteCompleted() {
    try {
      const query = 'DELETE FROM todos WHERE completed = true RETURNING *';
      const result = await pool.query(query);
      
      return result.rows.map(row => Todo.create(row));
    } catch (error) {
      logger.error('TodoRepository.deleteCompleted error:', error);
      throw new Error('Failed to delete completed todos');
    }
  }

  // 根據完成狀態獲取待辦事項
  async findByStatus(completed) {
    try {
      const query = `
        SELECT * FROM todos 
        WHERE completed = $1 
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query, [completed]);
      
      return result.rows.map(row => Todo.create(row));
    } catch (error) {
      logger.error('TodoRepository.findByStatus error:', error);
      throw new Error('Failed to fetch todos by status');
    }
  }

  // 統計待辦事項數量
  async count() {
    try {
      const query = 'SELECT COUNT(*) FROM todos';
      const result = await pool.query(query);
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('TodoRepository.count error:', error);
      throw new Error('Failed to count todos');
    }
  }

  // 搜索待辦事項
  async search(searchTerm) {
    try {
      const query = `
        SELECT * FROM todos 
        WHERE title ILIKE $1 
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query, [`%${searchTerm}%`]);
      
      return result.rows.map(row => Todo.create(row));
    } catch (error) {
      logger.error('TodoRepository.search error:', error);
      throw new Error('Failed to search todos');
    }
  }
}

module.exports = new TodoRepository();
