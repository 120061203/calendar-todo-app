import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../TodoList';
import * as api from '../../api';

// Mock API calls
jest.mock('../../api');

const mockTodos = [
  {
    id: 1,
    title: '完成專案文件',
    due_date: '2024-01-15',
    completed: false,
    created_at: '2025-08-29T08:13:16.120Z'
  },
  {
    id: 2,
    title: '準備會議簡報',
    due_date: '2024-01-20',
    completed: true,
    created_at: '2025-08-29T08:13:16.120Z'
  },
  {
    id: 3,
    title: '測試待辦事項',
    due_date: null,
    completed: false,
    created_at: '2025-08-29T09:00:00.000Z'
  }
];

describe('TodoList Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default API responses
    api.getTodos.mockResolvedValue({ data: mockTodos });
    api.addTodo.mockResolvedValue({ data: { id: 4, title: '新待辦事項', completed: false } });
    api.updateTodo.mockResolvedValue({ data: { id: 1, title: '完成專案文件', completed: true } });
    api.deleteTodo.mockResolvedValue({ data: { message: '刪除成功' } });
  });

  describe('Rendering', () => {
    test('應該正確渲染待辦事項標題', async () => {
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('待辦事項')).toBeInTheDocument();
      });
    });

    test('應該顯示新增待辦事項的輸入框', async () => {
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('新增待辦事項...')).toBeInTheDocument();
        expect(screen.getByLabelText('年/月/日')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\+/ })).toBeInTheDocument();
      });
    });

    test('應該顯示所有待辦事項', async () => {
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('完成專案文件')).toBeInTheDocument();
        expect(screen.getByText('準備會議簡報')).toBeInTheDocument();
        expect(screen.getByText('測試待辦事項')).toBeInTheDocument();
      });
    });

    test('應該顯示到期日期標籤', async () => {
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('2024/1/15')).toBeInTheDocument();
        expect(screen.getByText('2024/1/20')).toBeInTheDocument();
      });
    });
  });

  describe('Adding Todos', () => {
    test('應該能夠新增待辦事項', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('新增待辦事項...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('新增待辦事項...');
      const addButton = screen.getByRole('button', { name: /\+/ });
      
      await user.type(input, '新的待辦事項');
      await user.click(addButton);
      
      expect(api.addTodo).toHaveBeenCalledWith({
        title: '新的待辦事項',
        due_date: null
      });
    });

    test('應該能夠新增帶日期的待辦事項', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('新增待辦事項...')).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText('新增待辦事項...');
      const dateInput = screen.getByLabelText('年/月/日');
      const addButton = screen.getByRole('button', { name: /\+/ });
      
      await user.type(titleInput, '帶日期的待辦事項');
      await user.type(dateInput, '2024-02-01');
      await user.click(addButton);
      
      expect(api.addTodo).toHaveBeenCalledWith({
        title: '帶日期的待辦事項',
        due_date: '2024-02-01'
      });
    });

    test('空標題時不應該新增待辦事項', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /\+/ })).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /\+/ });
      await user.click(addButton);
      
      expect(api.addTodo).not.toHaveBeenCalled();
    });
  });

  describe('Completing Todos', () => {
    test('應該能夠標記待辦事項為完成', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('完成專案文件')).toBeInTheDocument();
      });

      const checkbox = screen.getAllByRole('checkbox')[0]; // 第一個待辦事項的 checkbox
      await user.click(checkbox);
      
      expect(api.updateTodo).toHaveBeenCalledWith(1, { completed: true });
    });

    test('應該能夠取消標記待辦事項', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('準備會議簡報')).toBeInTheDocument();
      });

      const checkbox = screen.getAllByRole('checkbox')[1]; // 第二個待辦事項的 checkbox (已完成)
      await user.click(checkbox);
      
      expect(api.updateTodo).toHaveBeenCalledWith(2, { completed: false });
    });
  });

  describe('Deleting Todos', () => {
    test('應該能夠刪除單個待辦事項', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('測試待辦事項')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId('delete-todo');
      const lastDeleteButton = deleteButtons[deleteButtons.length - 1]; // 最後一個待辦事項的刪除按鈕
      
      await user.click(lastDeleteButton);
      
      expect(api.deleteTodo).toHaveBeenCalledWith(3);
    });

    test('應該能夠清除所有已完成的待辦事項', async () => {
      const user = userEvent.setup();
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('清除已完成')).toBeInTheDocument();
      });

      const clearCompletedButton = screen.getByText('清除已完成');
      await user.click(clearCompletedButton);
      
      // 應該調用兩次 deleteTodo，因為有兩個已完成的待辦事項
      expect(api.deleteTodo).toHaveBeenCalledTimes(1);
      expect(api.deleteTodo).toHaveBeenCalledWith(2); // 準備會議簡報
    });
  });

  describe('Visual States', () => {
    test('已完成的待辦事項應該有正確的樣式', async () => {
      render(<TodoList />);
      
      await waitFor(() => {
        const completedTodo = screen.getByText('準備會議簡報').closest('li');
        expect(completedTodo).toHaveStyle({ opacity: '0.7' });
      });
    });

    test('未完成的待辦事項應該有正確的樣式', async () => {
      render(<TodoList />);
      
      await waitFor(() => {
        const pendingTodo = screen.getByText('完成專案文件').closest('li');
        expect(pendingTodo).toHaveStyle({ opacity: '1' });
      });
    });
  });

  describe('Error Handling', () => {
    test('API 錯誤時應該顯示錯誤訊息', async () => {
      api.getTodos.mockRejectedValue(new Error('API 錯誤'));
      
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByText('載入待辦事項失敗')).toBeInTheDocument();
      });
    });

    test('新增待辦事項失敗時應該顯示錯誤訊息', async () => {
      const user = userEvent.setup();
      api.addTodo.mockRejectedValue(new Error('新增失敗'));
      
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('新增待辦事項...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('新增待辦事項...');
      const addButton = screen.getByRole('button', { name: /\+/ });
      
      await user.type(input, '測試待辦事項');
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('新增待辦事項失敗')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    test('載入中應該顯示載入指示器', async () => {
      api.getTodos.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<TodoList />);
      
      expect(screen.getByText('載入中...')).toBeInTheDocument();
    });

    test('新增中應該禁用新增按鈕', async () => {
      const user = userEvent.setup();
      api.addTodo.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<TodoList />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('新增待辦事項...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('新增待辦事項...');
      const addButton = screen.getByRole('button', { name: /\+/ });
      
      await user.type(input, '測試待辦事項');
      await user.click(addButton);
      
      expect(addButton).toBeDisabled();
    });
  });
});
