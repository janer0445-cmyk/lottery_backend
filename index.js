import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

// Auto-create tables if they don’t exist
async function initDB() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Tickets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        numbers TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Prizes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prizes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
        amount NUMERIC NOT NULL,
        claimed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Database tables are ready!");
  } catch (err) {
    console.error("❌ Error setting up database tables:", err);
  }
}

// API route just to test
app.get("/", async (req, res) => {
  res.json({ message: "Lottery backend is live 🚀" });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await initDB();
});
