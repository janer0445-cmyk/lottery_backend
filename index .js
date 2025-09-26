import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Lottery Backend Running!");
});

// Lottery draw endpoint
app.get("/draw", (req, res) => {
  // Generate 6 random numbers between 1 and 49
  const numbers = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 49) + 1;
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
