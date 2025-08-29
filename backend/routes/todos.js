const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { title, due_date } = req.body;
  const result = await pool.query(
    "INSERT INTO todos (title, due_date) VALUES ($1, $2) RETURNING *",
    [title, due_date]
  );
  res.json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, due_date, completed } = req.body;
  
  try {
    let query, params;
    
    if (completed !== undefined) {
      // 只更新完成狀態
      query = "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *";
      params = [completed, id];
    } else {
      // 更新標題和日期
      query = "UPDATE todos SET title = $1, due_date = $2 WHERE id = $3 RETURNING *";
      params = [title, due_date, id];
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
