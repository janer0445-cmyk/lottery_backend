import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

// Create pool with SSL forced (needed for Supabase + Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // allow SSL from Supabase
  },
});

const app = express();
const PORT = process.env.PORT || 10000;

// Test DB connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to database");
    client.release();
  })
  .catch(err => {
    console.error("❌ DB connection error:", err);
  });

// Example route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Connected!", time: result.rows[0] });
  } catch (err) {
    console.error("❌ Query error:", err);
    res.status(500).json({ error: "DB query failed" });
  }
});

// Lottery draw route (still working)
app.get("/draw", (req, res) => {
  const numbers = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 49) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  res.json({ draw: numbers });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
