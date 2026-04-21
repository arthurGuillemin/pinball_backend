import * as scoreService from '../services/score.service.js';
import catchAsync from '../utils/catchAsync.js';

export const getLeaderboard = catchAsync(async (req, res) => {
  const scores = await scoreService.getLeaderboard();
  res.status(200).json({
    status: 'success',
    data: scores,
  });
});

export const addNewScore = catchAsync(async (req, res) => {
  const { playerName, score, avatar } = req.body;
  const newScore = await scoreService.addNewScore(playerName, score, avatar);
  res.status(201).json({
    status: 'success',
    data: newScore,
  });
});
