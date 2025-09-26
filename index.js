import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (req, res) => {
  res.send("Lottery Backend Running!");
});

// Lottery draw route
app.get("/draw", (req, res) => {
  const numbers = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 50) + 1; // 1–50 range
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  res.json({ draw: numbers });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
