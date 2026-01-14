const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// debug route: returns raw rows
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM site_content ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

// public route: returns key/value object
app.get("/content", async (req, res) => {
  try {
    const result = await pool.query("SELECT key, value FROM site_content ORDER BY id ASC");
    const content = {};
    for (const row of result.rows) content[row.key] = row.value;
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Content fetch failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
