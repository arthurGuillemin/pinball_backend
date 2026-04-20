import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

const postScoreLimiter = rateLimit({
  windowMs: 10 * 1000, //  10 secondes
  max: 5,
  message: {
    status: 'fail',
    message: 'too much requests',
    retryAfterSeconds: 10,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res, next, options) => {
    logger.warn({ ip: req.ip, path: req.originalUrl }, 'Rate limit exceeded');
    res.status(options.statusCode || 429).json(options.message);
  },
});

export default postScoreLimiter;
