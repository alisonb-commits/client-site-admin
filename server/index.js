const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();
app.use(cors());
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


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing token" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
}

// dev-only: create an admin user (run once)
app.post("/auth/seed-admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email + password required" });

    const password_hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email, password_hash]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "seed failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email + password required" });

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "login failed" });
  }
});

app.put("/content/:key", requireAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (typeof value !== "string") {
      return res.status(400).json({ error: "value must be a string" });
    }

    await pool.query(
      `INSERT INTO site_content (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, value]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "update failed" });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
