const express = require('express');
const TodoController = require('../controllers/TodoController');
const Todo = require('../models/Todo');
const router = express.Router();

// 獲取所有待辦事項
router.get('/', TodoController.getAllTodos.bind(TodoController));

// 獲取特定待辦事項
router.get('/:id', TodoController.getTodoById.bind(TodoController));

// 創建待辦事項
router.post('/', Todo.getValidationRules(), TodoController.createTodo.bind(TodoController));

// 更新待辦事項
router.put('/:id', Todo.getValidationRules(), TodoController.updateTodo.bind(TodoController));

// 刪除待辦事項
router.delete('/:id', TodoController.deleteTodo.bind(TodoController));

// 批量刪除已完成的待辦事項
router.delete('/completed/bulk', TodoController.deleteCompletedTodos.bind(TodoController));

// 切換待辦事項完成狀態
router.patch('/:id/toggle', TodoController.toggleTodoStatus.bind(TodoController));

// 根據狀態獲取待辦事項
router.get('/status/:status', TodoController.getTodosByStatus.bind(TodoController));

// 搜索待辦事項
router.get('/search', TodoController.searchTodos.bind(TodoController));

// 獲取待辦事項統計
router.get('/stats', TodoController.getTodoStats.bind(TodoController));

module.exports = router;
