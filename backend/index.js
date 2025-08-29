const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");

const todoRoutes = require("./routes/todos");
const eventRoutes = require("./routes/events");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/todos", todoRoutes);
app.use("/api/events", eventRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
