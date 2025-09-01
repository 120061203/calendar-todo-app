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
  Tooltip,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { 
  Event as EventIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
} from "@mui/icons-material";
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

  // 修復：強制本地時間解析，避免時區轉換
  // 統一時區處理：直接使用資料庫時間
  const handleProductionTimezone = (timeString, isAllDay = false) => {
    if (!timeString) return null;
    
    if (isAllDay) {
      // 整天事件只返回日期，不包含時間
      const date = new Date(timeString);
      return date;
    }
    
    return parseLocalTime(timeString);
  };

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      
      // 修復：直接使用資料庫時間，不進行時區轉換
      const formattedEvents = res.data.map(e => {
        const isAllDay = e.is_all_day || false;
        
        // 整天事件和普通事件使用不同的解析方式
        const start = isAllDay ? new Date(e.start_time) : parseLocalTime(e.start_time);
        const end = isAllDay ? new Date(e.end_time) : parseLocalTime(e.end_time);
        
        return {
          id: e.id,
          title: e.title,
          start: start,
          end: end,
          allDay: isAllDay
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
        start: handleProductionTimezone(res.data.start_time, res.data.is_all_day),
        end: handleProductionTimezone(res.data.end_time, res.data.is_all_day),
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
    
    // 格式化日期為 YYYY-MM-DDTHH:mm 格式（非整天事件）或 YYYY-MM-DD 格式（整天事件）
    const formatDateForInput = (date, isAllDay = false) => {
      if (!date) return "";
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      if (isAllDay) {
        return `${year}-${month}-${day}`;
      } else {
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
    };
    
    setEditingEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start_time: formatDateForInput(clickInfo.event.start, clickInfo.event.allDay),
      end_time: formatDateForInput(clickInfo.event.end, clickInfo.event.allDay),
      is_all_day: clickInfo.event.allDay
    });
    setOpenDialog(true);
  };

  const handleEditEvent = async () => {
    console.log("開始更新事件...");
    console.log("編輯事件數據:", editingEvent);
    
    if (!editingEvent.title || (!editingEvent.is_all_day && (!editingEvent.start_time || !editingEvent.end_time))) {
      console.error("缺少必要字段:", {
        title: editingEvent.title,
        start_time: editingEvent.start_time,
        end_time: editingEvent.end_time
      });
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
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                  />
                }
                label="整天事件"
              />
              
              {!(editingEvent ? editingEvent.is_all_day : newEvent.is_all_day) && (
                <>
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
                { label: "4小時", minutes: 240 },
                { label: "6小時", minutes: 360 },
                { label: "12小時", minutes: 720 }
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
                    value={(() => {
                      const endTime = editingEvent ? editingEvent.end_time : newEvent.end_time;
                      if (!endTime) return "";
                      
                      // 整天事件的結束日期需要減一天來顯示，因為我們在保存時加了一天
                      if (endTime.includes('T')) {
                        // 有時間部分，直接分割
                        return endTime.split('T')[0];
                      } else {
                        // 只有日期部分，需要減一天
                        const endDate = new Date(endTime);
                        endDate.setDate(endDate.getDate() - 1);
                        return endDate.toISOString().split('T')[0];
                      }
                    })()}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      // 整天事件的結束日期需要加一天，因為整天事件是包含結束日期的
                      if (dateValue) {
                        const endDate = new Date(dateValue);
                        endDate.setDate(endDate.getDate() + 1);
                        const adjustedDateValue = endDate.toISOString().split('T')[0];
                        
                        if (editingEvent) {
                          setEditingEvent({ ...editingEvent, end_time: adjustedDateValue });
                        } else {
                          setNewEvent({ ...newEvent, end_time: adjustedDateValue });
                        }
                      } else {
                        if (editingEvent) {
                          setEditingEvent({ ...editingEvent, end_time: dateValue });
                        } else {
                          setNewEvent({ ...newEvent, end_time: dateValue });
                        }
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
                  (!newEvent.is_all_day && (!newEvent.start_time || !newEvent.end_time)) ||
                  (!newEvent.is_all_day && new Date(newEvent.end_time) <= new Date(newEvent.start_time))
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
