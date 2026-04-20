import * as healthService from '../services/health.service.js';
import catchAsync from '../utils/catchAsync.js';

export const getHealth = catchAsync(async (req, res) => {
  const health = await healthService.getHealth();

  res.status(200).json({
    status: 'success',
    data: health,
  });
});
