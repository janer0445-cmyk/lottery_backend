import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Home route
app.get("/", (req, res) => {
  res.send("🎉 Lottery backend is live! Available routes: /tickets, /prizes, /draw");
});

// ✅ Tickets route
app.get("/tickets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tickets");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Prizes route
app.get("/prizes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM prizes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Draw route (latest draw only)
app.get("/draw", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM draws ORDER BY created_at DESC LIMIT 1");
    res.json(result.rows[0] || { message: "No draw yet" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase on Render
});

// ✅ Health check route
app.get("/health", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    res.json({ status: "ok", message: "Connected to Supabase ✅" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ Example routes (your existing ones)
app.get("/", (req, res) => {
  res.send("🎉 Lottery backend is live! Available routes: /tickets, /prizes, /draw, /health");
});

// Keep your other routes here (tickets, prizes, draw...)

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});)
