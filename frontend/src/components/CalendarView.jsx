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
  FormControlLabel,
  Checkbox,
  Chip
} from "@mui/material";
import { 
  Event as EventIcon, 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Repeat as RepeatIcon,
  AllInclusive as AllDayIcon
} from "@mui/icons-material";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents, addEvent, updateEvent, deleteEvent } from "../api";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start_time: "",
    end_time: "",
    is_all_day: false,
    repeat_type: "",
    repeat_until: ""
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
          allDay: e.is_all_day || false,
          extendedProps: {
            repeatType: e.repeat_type,
            repeatUntil: e.repeat_until,
            originalEventId: e.original_event_id
          }
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
        is_all_day: newEvent.is_all_day,
        repeat_type: newEvent.repeat_type || null,
        repeat_until: newEvent.repeat_until || null
      };
      
      console.log("發送事件數據:", eventData);
      
      const res = await addEvent(eventData);
      
      // 從後端返回的數據使用時區處理函數
      const formattedEvent = {
        id: res.data.id,
        title: res.data.title,
        start: parseLocalTime(res.data.start_time),
        end: parseLocalTime(res.data.end_time),
        allDay: res.data.is_all_day || false,
        extendedProps: {
          repeatType: res.data.repeat_type,
          repeatUntil: res.data.repeat_until,
          originalEventId: res.data.original_event_id
        }
      };
      
      console.log("格式化後的事件:", formattedEvent);
      
      // 重新載入所有事件，確保時區處理一致
      await loadEvents();
      setNewEvent({ title: "", start_time: "", end_time: "", is_all_day: false, repeat_type: "", repeat_until: "" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setNewEvent({ title: "", start_time: "", end_time: "", is_all_day: false, repeat_type: "", repeat_until: "" });
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
      is_all_day: clickInfo.event.allDay,
      repeat_type: clickInfo.event.extendedProps.repeatType || "",
      repeat_until: clickInfo.event.extendedProps.repeatUntil || ""
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
        is_all_day: editingEvent.is_all_day,
        repeat_type: editingEvent.repeat_type || null,
        repeat_until: editingEvent.repeat_until || null
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

  // 處理事件拖曳
  const handleEventDrop = async (dropInfo) => {
    const { event } = dropInfo;
    console.log("Event dropped:", event);
    
    try {
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

      const eventData = {
        title: event.title,
        start_time: formatDateForInput(event.start),
        end_time: formatDateForInput(event.end),
        is_all_day: event.allDay
      };
      
      await updateEvent(event.id, eventData);
      await loadEvents();
    } catch (error) {
      console.error("Failed to update event after drop:", error);
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
            fontSize: "1.2rem !important"
          },
          "& .fc-button": {
            borderRadius: "8px !important",
            textTransform: "none !important",
            fontWeight: "600 !important"
          },
          "& .fc-event": {
            borderRadius: "6px !important",
            border: "none !important"
          },
          "& .fc-event-main": {
            padding: "2px 4px !important"
          }
        }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            locale="zh-tw"
            events={events}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
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
            eventDisplay="block"
            timeZone="local"
          />
        </Box>

        {/* 事件對話框 */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingEvent ? "編輯事件" : "新增事件"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="事件標題"
                value={editingEvent?.title || newEvent.title}
                onChange={(e) => {
                  if (editingEvent) {
                    setEditingEvent({ ...editingEvent, title: e.target.value });
                  } else {
                    setNewEvent({ ...newEvent, title: e.target.value });
                  }
                }}
                fullWidth
                required
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editingEvent?.is_all_day || newEvent.is_all_day}
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

              {!(editingEvent?.is_all_day || newEvent.is_all_day) && (
                <>
                  <TextField
                    label="開始時間"
                    type="datetime-local"
                    value={editingEvent?.start_time || newEvent.start_time}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, start_time: e.target.value });
                      } else {
                        setNewEvent({ ...newEvent, start_time: e.target.value });
                      }
                    }}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <TextField
                    label="結束時間"
                    type="datetime-local"
                    value={editingEvent?.end_time || newEvent.end_time}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, end_time: e.target.value });
                      } else {
                        setNewEvent({ ...newEvent, end_time: e.target.value });
                      }
                    }}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              {(editingEvent?.is_all_day || newEvent.is_all_day) && (
                <>
                  <TextField
                    label="開始日期"
                    type="date"
                    value={editingEvent?.start_time?.split('T')[0] || newEvent.start_time?.split('T')[0] || ""}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, start_time: dateValue });
                      } else {
                        setNewEvent({ ...newEvent, start_time: dateValue });
                      }
                    }}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <TextField
                    label="結束日期"
                    type="date"
                    value={editingEvent?.end_time?.split('T')[0] || newEvent.end_time?.split('T')[0] || ""}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, end_time: dateValue });
                      } else {
                        setNewEvent({ ...newEvent, end_time: dateValue });
                      }
                    }}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              <FormControl fullWidth>
                <InputLabel>重複</InputLabel>
                <Select
                  value={editingEvent?.repeat_type || newEvent.repeat_type}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, repeat_type: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, repeat_type: e.target.value });
                    }
                  }}
                  label="重複"
                >
                  <MenuItem value="">不重複</MenuItem>
                  <MenuItem value="daily">每日</MenuItem>
                  <MenuItem value="weekly">每週</MenuItem>
                  <MenuItem value="monthly">每月</MenuItem>
                  <MenuItem value="yearly">每年</MenuItem>
                </Select>
              </FormControl>

              {(editingEvent?.repeat_type || newEvent.repeat_type) && (
                <TextField
                  label="重複直到"
                  type="date"
                  value={editingEvent?.repeat_until || newEvent.repeat_until}
                  onChange={(e) => {
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, repeat_until: e.target.value });
                    } else {
                      setNewEvent({ ...newEvent, repeat_until: e.target.value });
                    }
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            {editingEvent && (
              <Button 
                onClick={handleDeleteEvent} 
                color="error"
                startIcon={<DeleteIcon />}
              >
                刪除
              </Button>
            )}
            <Button onClick={handleCloseDialog}>取消</Button>
            <Button 
              onClick={editingEvent ? handleEditEvent : handleAddEvent} 
              variant="contained"
              startIcon={editingEvent ? <EditIcon /> : <AddIcon />}
            >
              {editingEvent ? "更新" : "新增"}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
