import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarView from '../CalendarView';
import * as api from '../../api';

// Mock API calls
jest.mock('../../api');

const mockEvents = [
  {
    id: 1,
    title: '團隊會議',
    start_time: '2024-01-15T01:00:00.000Z',
    end_time: '2024-01-15T02:00:00.000Z',
    created_at: '2025-08-29T08:13:22.547Z'
  },
  {
    id: 2,
    title: '客戶拜訪',
    start_time: '2024-01-16T06:00:00.000Z',
    end_time: '2024-01-16T08:00:00.000Z',
    created_at: '2025-08-29T08:13:22.547Z'
  },
  {
    id: 3,
    title: '專案檢討',
    start_time: '2024-01-17T05:00:00.000Z',
    end_time: '2024-01-17T07:00:00.000Z',
    created_at: '2025-08-29T08:13:22.547Z'
  }
];

describe('CalendarView Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default API responses
    api.getEvents.mockResolvedValue({ data: mockEvents });
    api.addEvent.mockResolvedValue({ data: { id: 4, title: '新事件', start_time: '2024-01-18T10:00:00.000Z', end_time: '2024-01-18T11:00:00.000Z' } });
    api.updateEvent.mockResolvedValue({ data: { id: 1, title: '更新的會議', start_time: '2024-01-15T01:00:00.000Z', end_time: '2024-01-15T02:00:00.000Z' } });
    api.deleteEvent.mockResolvedValue({ data: { message: '刪除成功' } });
  });

  describe('Rendering', () => {
    test('應該正確渲染行事曆標題', async () => {
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('行事曆')).toBeInTheDocument();
      });
    });

    test('應該顯示新增事件按鈕', async () => {
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });
    });

    test('應該顯示行事曆標題', async () => {
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('行事曆')).toBeInTheDocument();
      });
    });

    test('應該顯示新增事件按鈕', async () => {
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });
    });

    test('應該渲染 FullCalendar 組件', async () => {
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
      });
    });
  });

  describe('Adding Events', () => {
    test('應該能夠打開新增事件對話框', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      expect(screen.getByText('新增行事曆事件')).toBeInTheDocument();
      expect(screen.getByLabelText('事件標題')).toBeInTheDocument();
      expect(screen.getByLabelText('開始時間')).toBeInTheDocument();
      expect(screen.getByLabelText('結束時間')).toBeInTheDocument();
    });

    test('應該能夠新增事件', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const titleInput = screen.getByLabelText('事件標題');
      const startTimeInput = screen.getByLabelText('開始時間');
      const endTimeInput = screen.getByLabelText('結束時間');
      
      await user.type(titleInput, '測試事件');
      await user.type(startTimeInput, '2024-01-18T10:00');
      await user.type(endTimeInput, '2024-01-18T11:00');
      
      const submitButton = screen.getByText('✓ 新增');
      await user.click(submitButton);
      
      expect(api.addEvent).toHaveBeenCalledWith({
        title: '測試事件',
        start_time: '2024-01-18T10:00',
        end_time: '2024-01-18T11:00'
      });
    });

    test('空標題時不應該新增事件', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const startTimeInput = screen.getByLabelText('開始時間');
      const endTimeInput = screen.getByLabelText('結束時間');
      
      await user.type(startTimeInput, '2024-01-18T10:00');
      await user.type(endTimeInput, '2024-01-18T11:00');
      
      const submitButton = screen.getByText('✓ 新增');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Quick Duration Settings', () => {
    test('應該顯示快速設定時長按鈕', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      expect(screen.getByText('快速設定時長：')).toBeInTheDocument();
      expect(screen.getByText('30分鐘')).toBeInTheDocument();
      expect(screen.getByText('1小時')).toBeInTheDocument();
      expect(screen.getByText('2小時')).toBeInTheDocument();
      expect(screen.getByText('半天')).toBeInTheDocument();
    });

    test('30分鐘按鈕應該正確計算結束時間', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const startTimeInput = screen.getByLabelText('開始時間');
      await user.type(startTimeInput, '2024-01-18T10:00');
      
      const thirtyMinButton = screen.getByText('30分鐘');
      await user.click(thirtyMinButton);
      
      const endTimeInput = screen.getByLabelText('結束時間');
      expect(endTimeInput.value).toBe('2024-01-18T10:30');
    });

    test('1小時按鈕應該正確計算結束時間', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const startTimeInput = screen.getByLabelText('開始時間');
      await user.type(startTimeInput, '2024-01-18T10:00');
      
      const oneHourButton = screen.getByText('1小時');
      await user.click(oneHourButton);
      
      const endTimeInput = screen.getByLabelText('結束時間');
      expect(endTimeInput.value).toBe('2024-01-18T11:00');
    });

    test('2小時按鈕應該正確計算結束時間', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const startTimeInput = screen.getByLabelText('開始時間');
      await user.type(startTimeInput, '2024-01-18T10:00');
      
      const twoHourButton = screen.getByText('2小時');
      await user.click(twoHourButton);
      
      const endTimeInput = screen.getByLabelText('結束時間');
      expect(endTimeInput.value).toBe('2024-01-18T12:00');
    });

    test('半天按鈕應該正確計算結束時間', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const startTimeInput = screen.getByLabelText('開始時間');
      await user.type(startTimeInput, '2024-01-18T10:00');
      
      const halfDayButton = screen.getByText('半天');
      await user.click(halfDayButton);
      
      const endTimeInput = screen.getByLabelText('結束時間');
      expect(endTimeInput.value).toBe('2024-01-18T14:00');
    });
  });

  describe('Now Buttons', () => {
    test('開始時間的現在按鈕應該設定當前時間', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const nowButton = screen.getAllByText('現在')[0]; // 開始時間的現在按鈕
      await user.click(nowButton);
      
      const startTimeInput = screen.getByLabelText('開始時間');
      const now = new Date();
      const expectedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      expect(startTimeInput.value).toBe(expectedTime);
    });

    test('結束時間的現在按鈕應該設定當前時間', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const nowButton = screen.getAllByText('現在')[1]; // 結束時間的現在按鈕
      await user.click(nowButton);
      
      const endTimeInput = screen.getByLabelText('結束時間');
      const now = new Date();
      const expectedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      expect(endTimeInput.value).toBe(expectedTime);
    });
  });

  describe('Editing Events', () => {
    test('應該能夠點擊事件進行編輯', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
      });

      const eventElement = screen.getByTestId('calendar-event-1');
      await user.click(eventElement);
      
      expect(screen.getByText('編輯行事曆事件')).toBeInTheDocument();
      expect(screen.getByDisplayValue('團隊會議')).toBeInTheDocument();
    });

    test('應該能夠更新事件', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
      });

      const eventElement = screen.getByTestId('calendar-event-1');
      await user.click(eventElement);
      
      const titleInput = screen.getByLabelText('事件標題');
      await user.clear(titleInput);
      await user.type(titleInput, '更新的會議標題');
      
      const updateButton = screen.getByText('✓ 更新');
      await user.click(updateButton);
      
      expect(api.updateEvent).toHaveBeenCalledWith(1, {
        title: '更新的會議標題',
        start_time: '2024-01-15T09:00',
        end_time: '2024-01-15T10:00'
      });
    });
  });

  describe('Deleting Events', () => {
    test('應該能夠刪除事件', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
      });

      const eventElement = screen.getByTestId('calendar-event-1');
      await user.click(eventElement);
      
      const deleteButton = screen.getByText('刪除');
      await user.click(deleteButton);
      
      expect(api.deleteEvent).toHaveBeenCalledWith(1);
    });
  });

  describe('Time Validation', () => {
    test('結束時間早於開始時間時應該顯示錯誤提示', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const titleInput = screen.getByLabelText('事件標題');
      const startTimeInput = screen.getByLabelText('開始時間');
      const endTimeInput = screen.getByLabelText('結束時間');
      
      await user.type(titleInput, '測試事件');
      await user.type(startTimeInput, '2024-01-18T10:00');
      await user.type(endTimeInput, '2024-01-18T09:00'); // 結束時間早於開始時間
      
      expect(screen.getByText('⚠️ 結束時間必須晚於開始時間')).toBeInTheDocument();
      expect(screen.getByText('✓ 新增')).toBeDisabled();
    });

    test('有效時間時應該啟用提交按鈕', async () => {
      const user = userEvent.setup();
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const titleInput = screen.getByLabelText('事件標題');
      const startTimeInput = screen.getByLabelText('開始時間');
      const endTimeInput = screen.getByLabelText('結束時間');
      
      await user.type(titleInput, '測試事件');
      await user.type(startTimeInput, '2024-01-18T10:00');
      await user.type(endTimeInput, '2024-01-18T11:00'); // 有效時間
      
      expect(screen.getByText('✓ 新增')).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    test('API 錯誤時應該在 console 中記錄錯誤', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      api.getEvents.mockRejectedValue(new Error('API 錯誤'));
      
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load events:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('新增事件失敗時應該在 console 中記錄錯誤', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      api.addEvent.mockRejectedValue(new Error('新增失敗'));
      
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const titleInput = screen.getByLabelText('事件標題');
      const startTimeInput = screen.getByLabelText('開始時間');
      const endTimeInput = screen.getByLabelText('結束時間');
      
      await user.type(titleInput, '測試事件');
      await user.type(startTimeInput, '2024-01-18T10:00');
      await user.type(endTimeInput, '2024-01-18T11:00');
      
      const submitButton = screen.getByText('✓ 新增');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to add event:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    test('載入中應該顯示空的行事曆', async () => {
      api.getEvents.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<CalendarView />);
      
      expect(screen.getByTestId('fullcalendar')).toBeInTheDocument();
      expect(screen.getByTestId('calendar-events')).toBeInTheDocument();
    });

    test('新增中按鈕應該保持可用狀態', async () => {
      const user = userEvent.setup();
      api.addEvent.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<CalendarView />);
      
      await waitFor(() => {
        expect(screen.getByText('新增事件')).toBeInTheDocument();
      });

      const addButton = screen.getByText('新增事件');
      await user.click(addButton);
      
      const titleInput = screen.getByLabelText('事件標題');
      const startTimeInput = screen.getByLabelText('開始時間');
      const endTimeInput = screen.getByLabelText('結束時間');
      
      await user.type(titleInput, '測試事件');
      await user.type(startTimeInput, '2024-01-18T10:00');
      await user.type(endTimeInput, '2024-01-18T11:00');
      
      const submitButton = screen.getByText('✓ 新增');
      await user.click(submitButton);
      
      // 組件沒有載入狀態，按鈕應該保持可用
      expect(submitButton).not.toBeDisabled();
    });
  });
});
