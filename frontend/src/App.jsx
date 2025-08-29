import { Box, Container, CssBaseline, ThemeProvider, AppBar, Toolbar, Typography } from "@mui/material";
import { Event as EventIcon } from "@mui/icons-material";
import TodoList from "./components/TodoList";
import CalendarView from "./components/CalendarView";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* 頂部導航欄 */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
          <Container maxWidth="xl">
            <Toolbar sx={{ px: { xs: 0 } }}>
              <EventIcon sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h6" component="div" sx={{ 
                flexGrow: 1, 
                fontWeight: "bold",
                color: "primary.main"
              }}>
                Calendar Todo App
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        {/* 主要內容區域 */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ 
            display: "flex", 
            gap: 3,
            flexDirection: { xs: "column", lg: "row" }
          }}>
            <TodoList />
            <CalendarView />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
