import { useEffect, useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton,
  Paper,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Tooltip
} from "@mui/material";
import { 
  Add as AddIcon, 
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingTodo, setUpdatingTodo] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const res = await getTodos();
      console.log("Loaded todos:", res.data);
      setTodos(res.data);
    } catch (error) {
      console.error("Failed to load todos:", error);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const todoData = {
        title: title.trim(),
        due_date: dueDate || null
      };
      const res = await addTodo(todoData);
      setTodos([res.data, ...todos]);
      setTitle("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (todo) => {
    if (updatingTodo === todo.id) return; // 防止重複點擊
    
    console.log("Toggling todo:", todo.id, "from", todo.completed, "to", !todo.completed);
    
    setUpdatingTodo(todo.id);
    try {
      const res = await updateTodo(todo.id, { completed: !todo.completed });
      
      console.log("Update response:", res.data);
      
      // 更新本地狀態
      setTodos(prevTodos => {
        const newTodos = prevTodos.map(t => 
          t.id === todo.id 
            ? { ...t, completed: res.data.completed }
            : t
        );
        console.log("New todos state:", newTodos);
        return newTodos;
      });
      
      console.log("Local state updated successfully");
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      // 如果更新失敗，顯示錯誤訊息
      alert(`更新失敗: ${error.message}`);
    } finally {
      setUpdatingTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      
      // 從本地列表中移除
      setTodos(todos.filter(t => t.id !== todoId));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  return (
    <Card elevation={3} sx={{ minHeight: 600, maxWidth: 400 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            color: "primary.main",
            fontWeight: "bold"
          }}>
            <CheckIcon color="primary" />
            待辦事項
          </Typography>
          
          {todos.some(todo => todo.completed) && (
            <Tooltip title="清除所有已完成的項目">
              <Button
                size="small"
                variant="outlined"
                color="error"
                                        onClick={async () => {
                          const completedTodos = todos.filter(todo => todo.completed);
                          if (completedTodos.length > 0) {
                            if (window.confirm(`確定要刪除 ${completedTodos.length} 個已完成的項目嗎？`)) {
                              try {
                                console.log("開始批量刪除:", completedTodos.length, "個項目");
                                
                                // 批量刪除所有已完成的項目
                                await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
                                
                                console.log("後端刪除完成，更新前端狀態");
                                
                                // 從本地狀態中移除所有已完成的項目
                                setTodos(prevTodos => {
                                  const newTodos = prevTodos.filter(todo => !todo.completed);
                                  console.log("前端狀態更新:", newTodos.length, "個項目剩餘");
                                  return newTodos;
                                });
                                
                                console.log(`成功刪除 ${completedTodos.length} 個已完成的項目`);
                              } catch (error) {
                                console.error("批量刪除失敗:", error);
                                alert("刪除失敗，請重試");
                              }
                            }
                          }
                        }}
                sx={{ fontSize: "0.75rem" }}
              >
                清除已完成
              </Button>
            </Tooltip>
          )}
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="新增待辦事項..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{ 
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2
                }
              }}
            />
            <TextField
              size="small"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              variant="outlined"
              sx={{ 
                minWidth: 140,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2
                }
              }}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              onClick={() => {
                console.log("Button clicked directly!");
                handleAdd();
              }}
              sx={{ 
                minWidth: "auto", 
                px: 2,
                borderRadius: 2,
                position: "relative",
                zIndex: 1,
                cursor: "pointer",
                bgcolor: "primary.main"
              }}
            >
              <AddIcon />
            </Button>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ bgcolor: "grey.50", borderRadius: 2 }}>
          <List sx={{ p: 0 }}>
            {todos.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="尚無待辦事項" 
                  secondary="開始新增你的第一個待辦事項吧！"
                  sx={{ textAlign: "center", color: "text.secondary" }}
                />
              </ListItem>
            ) : (
              todos.map((todo, index) => (
                <Box key={todo.id}>
                  <ListItem
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover"
                      },
                      opacity: todo.completed ? 0.7 : 1,
                      bgcolor: todo.completed ? "success.light" : "transparent",
                      borderRadius: 1,
                      mb: 0.5
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={Boolean(todo.completed)}
                        onChange={() => handleToggleComplete(todo)}
                        disabled={updatingTodo === todo.id}
                        color="primary"
                        sx={{
                          "&.Mui-checked": {
                            color: "primary.main"
                          }
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            textDecoration: todo.completed ? "line-through" : "none",
                            color: todo.completed ? "text.secondary" : "text.primary",
                            fontWeight: todo.completed ? "normal" : "medium"
                          }}
                        >
                          {todo.title}
                        </Typography>
                      }
                      secondary={
                        todo.due_date && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(todo.due_date)}
                            </Typography>
                          </Box>
                        )
                      }
                    />
                    {todo.due_date && (
                      <Chip 
                        label={formatDate(todo.due_date)} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    )}
                    <Tooltip title="刪除待辦事項">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTodo(todo.id)}
                        sx={{ 
                          color: "error.main",
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "white"
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                  {index < todos.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </List>
        </Paper>
      </CardContent>
    </Card>
  );
}
