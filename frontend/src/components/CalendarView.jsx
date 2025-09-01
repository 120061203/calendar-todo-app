import React, { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { 
  Event as EventIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  AllInclusive as AllDayIcon
} from "@mui/icons-material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { getEvents, addEvent, updateEvent, deleteEvent } from "../api";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start_time: "",
    end_time: "",
    is_all_day: false
  });

  useEffect(() => {
    loadEvents();
  }, []);

  // 修復時區問題：將 UTC 格式當作本地時間處理
  const parseLocalTime = (timeString) => {
    if (!timeString) return null;
    
    console.log('解析時間字符串:', timeString);
    
    // 處理 UTC 格式 (結尾有 Z) - 但當作本地時間處理
    if (timeString.endsWith('Z')) {
      // 提取時間部分，不進行時區轉換
      const match = timeString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        const [, year, month, day, hour, minute, second] = match;
        
        const localDate = new Date();
        localDate.setFullYear(parseInt(year));
        localDate.setMonth(parseInt(month) - 1);
        localDate.setDate(parseInt(day));
        localDate.setHours(parseInt(hour));
        localDate.setMinutes(parseInt(minute));
        localDate.setSeconds(parseInt(second));
        localDate.setMilliseconds(0);
        
        console.log(`UTC 格式當本地處理: ${timeString} -> ${localDate.toLocaleString('zh-TW')}`);
        return localDate;
      }
    }
    
    // 處理本地格式 YYYY-MM-DD HH:mm:ss
    const match = timeString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      
      const localDate = new Date();
      localDate.setFullYear(parseInt(year));
      localDate.setMonth(parseInt(month) - 1);
      localDate.setDate(parseInt(day));
      localDate.setHours(parseInt(hour));
      localDate.setMinutes(parseInt(minute));
      localDate.setSeconds(parseInt(second));
      localDate.setMilliseconds(0);
      
      console.log(`本地格式解析: ${timeString} -> ${localDate.toLocaleString('zh-TW')}`);
      return localDate;
    }
    
    // 嘗試直接解析其他格式
    const fallbackDate = new Date(timeString);
    if (!isNaN(fallbackDate.getTime())) {
      console.log(`直接解析: ${timeString} -> ${fallbackDate.toLocaleString('zh-TW')}`);
      return fallbackDate;
    }
    
    console.error('時間格式不匹配:', timeString);
    return null;
  };

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      
      // 修復：直接使用資料庫時間，不進行時區轉換
      const formattedEvents = res.data.map(e => {
        // 直接解析本地時間格式
        const start = parseLocalTime(e.start_time);
        const end = parseLocalTime(e.end_time);
        
        return {
          id: e.id,
          title: e.title,
          start: start,
          end: end,
          allDay: e.is_all_day || false
        };
      });
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || (!newEvent.is_all_day && (!newEvent.start_time || !newEvent.end_time))) return;
    
    try {
      // 確保時間以本地時間格式發送，不進行時區轉換
      const eventData = {
        title: newEvent.title,
        start_time: newEvent.start_time,
        end_time: newEvent.end_time,
        is_all_day: newEvent.is_all_day
      };
      
      console.log("發送事件數據:", eventData);
      
      const res = await addEvent(eventData);
      
      // 從後端返回的數據使用時區處理函數
      const formattedEvent = {
        id: res.data.id,
        title: res.data.title,
        start: parseLocalTime(res.data.start_time),
        end: parseLocalTime(res.data.end_time),
        allDay: res.data.is_all_day || false
      };
      
      console.log("格式化後的事件:", formattedEvent);
      
      // 重新載入所有事件，確保時區處理一致
      await loadEvents();
      setNewEvent({ title: "", start_time: "", end_time: "", is_all_day: false });
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setNewEvent({ title: "", start_time: "", end_time: "", is_all_day: false });
  };

  const handleEventClick = (clickInfo) => {
    console.log("Event clicked:", clickInfo.event);
    
    // 格式化日期為 YYYY-MM-DDTHH:mm 格式
    const formatDateForInput = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setEditingEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start_time: formatDateForInput(clickInfo.event.start),
      end_time: formatDateForInput(clickInfo.event.end),
      is_all_day: clickInfo.event.allDay
    });
    setOpenDialog(true);
  };

  const handleEditEvent = async () => {
    console.log("開始更新事件...");
    console.log("編輯事件數據:", editingEvent);
    
    if (!editingEvent.title || (!editingEvent.is_all_day && (!editingEvent.start_time || !editingEvent.end_time))) {
      console.error("缺少必要字段:", editingEvent);
      return;
    }
    
    try {
      // 確保時間以本地時間格式發送，不進行時區轉換
      const eventData = {
        title: editingEvent.title,
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time,
        is_all_day: editingEvent.is_all_day
      };
      
      console.log("更新事件數據:", eventData);
      
      const res = await updateEvent(editingEvent.id, eventData);
      console.log("API 回應:", res.data);
      
      // 重新載入所有事件，確保時區處理一致
      await loadEvents();
      
      handleCloseDialog();
      console.log("事件更新完成");
    } catch (error) {
      console.error("更新事件失敗:", error);
      console.error("錯誤詳情:", error.response?.data || error.message);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
    
    try {
      await deleteEvent(editingEvent.id);
      
      // 重新載入所有事件，確保時區處理一致
      await loadEvents();
      
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <Card elevation={3} sx={{ minHeight: 600, flex: 1 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            color: "primary.main",
            fontWeight: "bold"
          }}>
            <EventIcon color="primary" />
            行事曆
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            新增事件
          </Button>
        </Box>

        <Box sx={{ 
          bgcolor: "white", 
          borderRadius: 2, 
          overflow: "hidden",
          "& .fc": {
            fontFamily: "inherit"
          },
          "& .fc-toolbar-title": {
            fontSize: "1.2rem !important",
            fontWeight: "bold"
          },
          "& .fc-button": {
            borderRadius: "8px !important",
            textTransform: "none !important"
          },
          "& .fc-event": {
            borderRadius: "4px !important",
            border: "none !important"
          }
        }}>
          <FullCalendar 
            plugins={[dayGridPlugin]} 
            initialView="dayGridMonth" 
            events={events}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek"
            }}
            locale="zh-tw"
            buttonText={{
              today: "今天",
              month: "月",
              week: "週"
            }}
            eventClick={handleEventClick}
            editable={true}
            selectable={true}
            timeZone="local"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
          />
        </Box>

        {/* 新增/編輯事件對話框 */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            color: "primary.main"
          }}>
            <ScheduleIcon color="primary" />
            {editingEvent ? "編輯行事曆事件" : "新增行事曆事件"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="事件標題"
                value={editingEvent ? editingEvent.title : newEvent.title}
                onChange={(e) => {
                  if (editingEvent) {
                    setEditingEvent({ ...editingEvent, title: e.target.value });
                  } else {
                    setNewEvent({ ...newEvent, title: e.target.value });
                  }
                }}
                variant="outlined"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editingEvent ? editingEvent.is_all_day : newEvent.is_all_day}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, is_all_day: e.target.checked });
                      } else {
                        setNewEvent({ ...newEvent, is_all_day: e.target.checked });
                      }
                    }}
                    icon={<AllDayIcon />}
                    checkedIcon={<AllDayIcon />}
                  />
                }
                label="整天事件"
              />

              {!(editingEvent ? editingEvent.is_all_day : newEvent.is_all_day) && (
                <>
                  <TextField
                    fullWidth
                    label="開始時間"
                    type="datetime-local"
                    value={editingEvent ? editingEvent.start_time : newEvent.start_time}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, start_time: e.target.value });
                      } else {
                        setNewEvent({ ...newEvent, start_time: e.target.value });
                      }
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <TextField
                    fullWidth
                    label="結束時間"
                    type="datetime-local"
                    value={editingEvent ? editingEvent.end_time : newEvent.end_time}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, end_time: e.target.value });
                      } else {
                        setNewEvent({ ...newEvent, end_time: e.target.value });
                      }
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              {(editingEvent ? editingEvent.is_all_day : newEvent.is_all_day) && (
                <>
                  <TextField
                    fullWidth
                    label="開始日期"
                    type="date"
                    value={editingEvent ? editingEvent.start_time?.split('T')[0] : newEvent.start_time?.split('T')[0] || ""}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, start_time: dateValue });
                      } else {
                        setNewEvent({ ...newEvent, start_time: dateValue });
                      }
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <TextField
                    fullWidth
                    label="結束日期"
                    type="date"
                    value={editingEvent ? editingEvent.end_time?.split('T')[0] : newEvent.end_time?.split('T')[0] || ""}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, end_time: dateValue });
                      } else {
                        setNewEvent({ ...newEvent, end_time: dateValue });
                      }
                    }}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            {editingEvent && (
              <Button 
                onClick={handleDeleteEvent} 
                variant="outlined"
                color="error"
                sx={{ mr: "auto" }}
              >
                刪除
              </Button>
            )}
            <Button onClick={handleCloseDialog} variant="outlined">
              取消
            </Button>
            {editingEvent ? (
              <Button 
                onClick={handleEditEvent} 
                variant="contained"
                disabled={
                  !editingEvent.title || 
                  (!editingEvent.is_all_day && (!editingEvent.start_time || !editingEvent.end_time))
                }
                sx={{ 
                  minWidth: 80,
                  fontWeight: "bold"
                }}
              >
                ✓ 更新
              </Button>
            ) : (
              <Button 
                onClick={handleAddEvent} 
                variant="contained"
                disabled={
                  !newEvent.title || 
                  (!newEvent.is_all_day && (!newEvent.start_time || !newEvent.end_time))
                }
                sx={{ 
                  minWidth: 80,
                  fontWeight: "bold"
                }}
              >
                ✓ 新增
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
