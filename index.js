import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "eng.env" });


const app = express();
app.use(cors());
app.use(express.json());

// connect Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// health check
app.get("/", (req, res) => {
  res.send("Lottery backend is running 🚀");
});

// create user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const { data, error } = await supabase
    .from("Users")
    .insert([{ name, email }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// buy ticket
app.post("/tickets", async (req, res) => {
  const { user_id, numbers } = req.body;
  const { data, error } = await supabase
    .from("Tickets")
    .insert([{ user_id, numbers }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// list tickets
app.get("/tickets", async (req, res) => {
  const { data, error } = await supabase.from("Tickets").select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// record a draw
app.post("/draws", async (req, res) => {
  const { winning_numbers } = req.body;
  const { data, error } = await supabase
    .from("Draws")
    .insert([{ winning_numbers }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// list draws
app.get("/draws", async (req, res) => {
  const { data, error } = await supabase.from("Draws").select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
