const express = require("express");
const pool = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM calendar_events ORDER BY start_time ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, start_time, end_time } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    
    if (!start_time) {
      return res.status(400).json({ error: "Start time is required" });
    }
    
    if (!end_time) {
      return res.status(400).json({ error: "End time is required" });
    }
    
    const result = await pool.query(
      "INSERT INTO calendar_events (title, start_time, end_time) VALUES ($1, $2, $3) RETURNING *",
      [title, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, start_time, end_time } = req.body;
  
  try {
    const result = await pool.query(
      "UPDATE calendar_events SET title = $1, start_time = $2, end_time = $3 WHERE id = $4 RETURNING *",
      [title, start_time, end_time, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "DELETE FROM calendar_events WHERE id = $1 RETURNING *",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

module.exports = router;
