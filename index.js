const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Lottery Backend Running!");
});

app.get("/draw", (req, res) => {
  const numbers = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 49) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  res.json({ draw: numbers });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
