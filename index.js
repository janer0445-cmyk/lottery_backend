// index.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(bodyParser.json());
app.use(cors());

// connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// test route
app.get("/", (req, res) => {
  res.send("🎉 Lottery backend is live!");
});

// register new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, password]
    );
    res.json({ message: "✅ User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1 AND password=$2",
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ message: "✅ Login successful" });
    } else {
      res.status(401).json({ error: "❌ Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
