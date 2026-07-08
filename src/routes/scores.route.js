import { Router } from 'express';
import { getLeaderboard } from '../controllers/score.controller.js';
const router = Router();

// GET /api/scores/leaderboard - top 5 des leilleurs scores
router.get('/leaderboard', getLeaderboard);

export default router;
