import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
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
  Tooltip
} from "@mui/material";
import { 
  Event as EventIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material";
import { getEvents, addEvent, updateEvent, deleteEvent } from "../api";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start_time: "",
    end_time: ""
  });

  useEffect(() => {
    loadEvents();
  }, []);

  // 修復：時間解析工具函數，確保本地時間處理
  const parseLocalTime = (timeString) => {
    if (!timeString) return null;
    
    console.log('解析時間字符串:', timeString);
    
    // 方法1：直接解析為本地時間
    const localDate = new Date(timeString);
    
    // 方法2：如果方法1失敗，手動解析
    if (isNaN(localDate.getTime())) {
      console.log('方法1失敗，嘗試手動解析');
      
      // 假設格式為 YYYY-MM-DD HH:mm:ss
      const match = timeString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        const [, year, month, day, hour, minute, second] = match;
        const manualDate = new Date(
          parseInt(year),
          parseInt(month) - 1, // 月份從0開始
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        );
        
        console.log('手動解析結果:', manualDate.toLocaleString('zh-TW'));
        return manualDate;
      }
    }
    
    console.log('解析結果:', localDate.toLocaleString('zh-TW'));
    return localDate;
  };

  // 修復：強制本地時間解析，避免時區轉換
  const forceLocalTime = (timeString) => {
    if (!timeString) return null;
    
    // 強制以本地時間解析，避免時區轉換
    const match = timeString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      
      // 創建本地時間對象，強制指定為本地時間
      const localDate = new Date();
      localDate.setFullYear(parseInt(year));
      localDate.setMonth(parseInt(month) - 1); // 月份從0開始
      localDate.setDate(parseInt(day));
      localDate.setHours(parseInt(hour));
      localDate.setMinutes(parseInt(minute));
      localDate.setSeconds(parseInt(second));
      localDate.setMilliseconds(0);
      
      console.log(`強制本地時間: ${timeString} -> ${localDate.toLocaleString('zh-TW')}`);
      return localDate;
    }
    
    console.error('時間格式不匹配:', timeString);
    return null;
  };

  // 生產環境專用：處理 Supabase 時區問題
  const handleProductionTimezone = (timeString) => {
    if (!timeString) return null;
    
    // 檢查是否在生產環境
    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
      console.log('生產環境時區處理:', timeString);
      
      // 如果是 UTC 格式 (結尾有 Z)，需要轉換為本地時間
      if (timeString.endsWith('Z')) {
        const utcDate = new Date(timeString);
        // 強制轉換為本地時間 (UTC+8)
        const localDate = new Date(utcDate.getTime() + (8 * 60 * 60 * 1000));
        console.log(`UTC 轉本地: ${timeString} -> ${localDate.toLocaleString('zh-TW')}`);
        return localDate;
      }
      
      // 如果不是 UTC 格式，但仍然是時間字符串，也進行處理
      if (typeof timeString === 'string' && timeString.includes('-') && timeString.includes(':')) {
        // 假設這是本地時間字符串，直接解析
        const localDate = new Date(timeString);
        if (!isNaN(localDate.getTime())) {
          console.log(`本地時間解析: ${timeString} -> ${localDate.toLocaleString('zh-TW')}`);
          return localDate;
        }
      }
    }
    
    // 非生產環境或非 UTC 格式，使用原有邏輯
    return forceLocalTime(timeString);
  };

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      
      // 修復：使用強制本地時間函數，避免時區轉換
      const formattedEvents = res.data.map(e => {
        // 使用強制本地時間函數
        const start = handleProductionTimezone(e.start_time);
        const end = handleProductionTimezone(e.end_time);
        
        return {
          id: e.id,
          title: e.title,
          start: start,
          end: end
        };
      });
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) return;
    
    try {
      // 確保時間以本地時間格式發送，不進行時區轉換
      const eventData = {
        title: newEvent.title,
        start_time: newEvent.start_time,
        end_time: newEvent.end_time
      };
      
      console.log("發送事件數據:", eventData);
      
      const res = await addEvent(eventData);
      
      // 從後端返回的數據使用時區處理函數
      const formattedEvent = {
        id: res.data.id,
        title: res.data.title,
        start: handleProductionTimezone(res.data.start_time),
        end: handleProductionTimezone(res.data.end_time)
      };
      
      console.log("格式化後的事件:", formattedEvent);
      
      setEvents([...events, formattedEvent]);
      setNewEvent({ title: "", start_time: "", end_time: "" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setNewEvent({ title: "", start_time: "", end_time: "" });
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
      end_time: formatDateForInput(clickInfo.event.end)
    });
    setOpenDialog(true);
  };

  const handleEditEvent = async () => {
    if (!editingEvent.title || !editingEvent.start_time || !editingEvent.end_time) return;
    
    try {
      // 確保時間以本地時間格式發送，不進行時區轉換
      const eventData = {
        title: editingEvent.title,
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time
      };
      
      console.log("更新事件數據:", eventData);
      
      const res = await updateEvent(editingEvent.id, eventData);
      
      // 更新本地事件列表，使用時區處理函數
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? {
              ...event,
              title: res.data.title,
              start: handleProductionTimezone(res.data.start_time),
              end: handleProductionTimezone(res.data.end_time)
            }
          : event
      ));
      
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to edit event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
    
    try {
      await deleteEvent(editingEvent.id);
      
      // 從本地事件列表中移除
      setEvents(events.filter(event => event.id !== editingEvent.id));
      
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
            {/* 調試信息 - 顯示時間解析過程 */}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1, fontSize: '0.75rem' }}>
                <Typography variant="caption" color="text.secondary">
                  🐛 調試信息：
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <div>開始時間: {editingEvent ? editingEvent.start_time : newEvent.start_time}</div>
                  <div>結束時間: {editingEvent ? editingEvent.end_time : newEvent.end_time}</div>
                  {editingEvent && (
                    <>
                      <div>解析後開始: {parseLocalTime(editingEvent.start_time)?.toLocaleString('zh-TW')}</div>
                      <div>解析後結束: {parseLocalTime(editingEvent.end_time)?.toLocaleString('zh-TW')}</div>
                    </>
                  )}
                </Box>
              </Box>
            )}
            
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
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const now = new Date();
                    // 格式化為本地時間（UTC+8）
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const formattedNow = `${year}-${month}-${day}T${hours}:${minutes}`;
                    
                    console.log("設定現在時間:", formattedNow);
                    
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, start_time: formattedNow });
                    } else {
                      setNewEvent({ ...newEvent, start_time: formattedNow });
                    }
                  }}
                  sx={{ minWidth: "auto", px: 1 }}
                >
                  現在
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const now = new Date();
                    // 格式化為本地時間（UTC+8）
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const formattedNow = `${year}-${month}-${day}T${hours}:${minutes}`;
                    
                    console.log("設定現在時間:", formattedNow);
                    
                    if (editingEvent) {
                      setEditingEvent({ ...editingEvent, end_time: formattedNow });
                    } else {
                      setNewEvent({ ...newEvent, end_time: formattedNow });
                    }
                  }}
                  sx={{ minWidth: "auto", px: 1 }}
                >
                  現在
                </Button>
              </Box>
              
              {/* 時間驗證提示 */}
              {((editingEvent && editingEvent.start_time && editingEvent.end_time) || 
                (newEvent.start_time && newEvent.end_time)) && (
                <Box sx={{ mt: 1 }}>
                  {(() => {
                    const startTime = editingEvent ? editingEvent.start_time : newEvent.start_time;
                    const endTime = editingEvent ? editingEvent.end_time : newEvent.end_time;
                    if (startTime && endTime) {
                      const start = new Date(startTime);
                      const end = new Date(endTime);
                      if (end <= start) {
                        return (
                          <Typography variant="caption" color="error" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            ⚠️ 結束時間必須晚於開始時間
                          </Typography>
                        );
                      }
                    }
                    return null;
                  })()}
                </Box>
              )}
              
              {/* 快速時間設定 */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="caption" color="text.secondary" sx={{ width: "100%", mb: 1 }}>
                  快速設定時長：
                </Typography>
                {[
                  { label: "30分鐘", minutes: 30 },
                  { label: "1小時", minutes: 60 },
                  { label: "2小時", minutes: 120 },
                  { label: "半天", minutes: 240 }
                ].map((option) => (
                  <Button
                    key={option.minutes}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const startTime = editingEvent ? editingEvent.start_time : newEvent.start_time;
                      if (startTime) {
                        try {
                          // 解析開始時間
                          const start = new Date(startTime);
                          if (isNaN(start.getTime())) {
                            console.error("無效的開始時間:", startTime);
                            return;
                          }
                          
                          // 直接計算結束時間（避免時區問題）
                          const endMinutes = start.getMinutes() + option.minutes;
                          const endHours = start.getHours() + Math.floor(endMinutes / 60);
                          const finalMinutes = endMinutes % 60;
                          
                          // 處理日期變化（如果小時超過24）
                          let endDate = new Date(start);
                          if (endHours >= 24) {
                            endDate.setDate(endDate.getDate() + Math.floor(endHours / 24));
                            endDate.setHours(endHours % 24);
                          } else {
                            endDate.setHours(endHours);
                          }
                          endDate.setMinutes(finalMinutes);
                          endDate.setSeconds(0);
                          endDate.setMilliseconds(0);
                          
                          // 格式化為本地時間
                          const year = endDate.getFullYear();
                          const month = String(endDate.getMonth() + 1).padStart(2, '0');
                          const day = String(endDate.getDate()).padStart(2, '0');
                          const hours = String(endDate.getHours()).padStart(2, '0');
                          const minutes = String(endDate.getMinutes()).padStart(2, '0');
                          const formattedEnd = `${year}-${month}-${day}T${hours}:${minutes}`;
                          
                          console.log(`設定時長: ${option.label}`);
                          console.log(`  開始時間: ${startTime}`);
                          console.log(`  計算後結束時間: ${formattedEnd}`);
                          console.log(`  時間差: ${option.minutes} 分鐘`);
                          
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, end_time: formattedEnd });
                          } else {
                            setNewEvent({ ...newEvent, end_time: formattedEnd });
                          }
                        } catch (error) {
                          console.error("設定時長失敗:", error);
                        }
                      } else {
                        console.log("請先設定開始時間");
                      }
                    }}
                    sx={{ fontSize: "0.75rem", px: 1 }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
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
                  !editingEvent.start_time || 
                  !editingEvent.end_time ||
                  new Date(editingEvent.end_time) <= new Date(editingEvent.start_time)
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
                  !newEvent.start_time || 
                  !newEvent.end_time ||
                  new Date(newEvent.end_time) <= new Date(newEvent.start_time)
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
