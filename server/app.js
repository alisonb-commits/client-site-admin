const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const requireAuth = require("./requireAuth");

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// public route: returns key/value object
app.get("/content", async (req, res) => {
  try {
    const result = await pool.query("SELECT key, value FROM site_content");
    const data = {};
    result.rows.forEach((row) => {
      data[row.key] = row.value;
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// protected route
app.put("/content/:key", requireAuth, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  try {
    await pool.query(
      "UPDATE site_content SET value = $1 WHERE key = $2",
      [value, key]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update content" });
  }
});

module.exports = app;
