import { Router } from 'express';
import validate from '../middlewares/vaildate.js';
import { scoreSchema } from '../validators/score.validator.js';
import { getLeaderboard } from '../controllers/score.controller.js';
import postScoreLimiter from '../middlewares/rateLimit.js';
const router = Router();

// GET /api/scores/leaderboard - top 5
router.get('/leaderboard', getLeaderboard);

export default router;
