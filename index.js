import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(express.json());

// Test DB connection
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ server_time: result.rows[0] });
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).send("Database connection error");
  }
});

// Lottery draw route
app.get("/draw", (req, res) => {
  // Generate 6 random numbers between 1 and 49
  const numbers = [];
  while (numbers.length < 6) {
    const n = Math.floor(Math.random() * 49) + 1;
    if (!numbers.includes(n)) {
      numbers.push(n);
    }
  }
  res.json({ draw: numbers });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
