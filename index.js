import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // From Render
  ssl: { rejectUnauthorized: false }
});

// ✅ 1. Create a new draw
app.post("/draw", async (req, res) => {
  try {
    const { numbers } = req.body; // e.g. "5,12,19,34,40,47"
    const result = await pool.query(
      "INSERT INTO draws (numbers) VALUES ($1) RETURNING *",
      [numbers]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. Create a new ticket
app.post("/ticket", async (req, res) => {
  try {
    const { user_id, numbers, draw_id } = req.body;
    const result = await pool.query(
      "INSERT INTO tickets (user_id, numbers, draw_id) VALUES ($1, $2, $3) RETURNING *",
      [user_id, numbers, draw_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 3. Check results for a draw
app.get("/results/:draw_id", async (req, res) => {
  try {
    const { draw_id } = req.params;

    // Get the winning numbers
    const draw = await pool.query("SELECT * FROM draws WHERE id = $1", [draw_id]);
    if (draw.rows.length === 0) {
      return res.status(404).json({ error: "Draw not found" });
    }
    const winningNumbers = draw.rows[0].numbers.split(",").map(n => parseInt(n.trim()));

    // Get all tickets for this draw
    const tickets = await pool.query("SELECT * FROM tickets WHERE draw_id = $1", [draw_id]);

    let updatedTickets = [];

    for (let ticket of tickets.rows) {
      const userNumbers = ticket.numbers.split(",").map(n => parseInt(n.trim()));

      // Count matches
      let matches = userNumbers.filter(n => winningNumbers.includes(n)).length;

      // Decide prize
      let prize = 0;
      if (matches === 3) prize = 100;      // Example: 3 matches = $100
      if (matches === 4) prize = 1000;     // 4 matches = $1000
      if (matches === 5) prize = 10000;    // 5 matches = $10,000
      if (matches === 6) prize = 1000000;  // Jackpot!

      let status = prize > 0 ? "won" : "lost";

      // Update ticket
      const updated = await pool.query(
        "UPDATE tickets SET prize = $1, status = $2 WHERE id = $3 RETURNING *",
        [prize, status, ticket.id]
      );
      updatedTickets.push(updated.rows[0]);
    }

    res.json({ draw: draw.rows[0], results: updatedTickets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
