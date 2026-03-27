import { Router } from "express";
import validate from "../middlewares/vaildate.js";
import { scoreSchema } from "../validators/score.validator.js";
import {
  getLeaderboard,
  addNewScore,
} from "../controllers/score.controller.js";
const router = Router();

// GET /api/scores - top 10
router.get("/", getLeaderboard);

// POST /api/scores - add score
router.post("/", validate(scoreSchema), addNewScore);

export default router;
