import { Router } from "express";
import supabase from "../config/db.js";

const router = Router();

// GET /api/scores - top 10
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/scores - add score
router.post("/", async (req, res) => {
  try {
    const { player_name, score } = req.body;
    if (!player_name || !score) {
      return res.status(400).json({ error: "player name & score rerquired" });
    }
    const { data, error } = await supabase
      .from("scores")
      .insert({ player_name, score })
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
