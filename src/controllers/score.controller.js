import * as scoreService from "../services/score.service.js";

export const getLeaderboard = async (req, res) => {
  try {
    const scores = await scoreService.getLeaderboard();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addNewScore = async (req, res) => {
  try {
    const { playerName, score } = req.body;
    const newScore = await scoreService.addNewScore(playerName, score);
    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
