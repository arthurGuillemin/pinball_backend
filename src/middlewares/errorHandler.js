import logger from '../utils/logger.js';
import { isOperationalError } from '../utils/appError.js';

/**
 * errorHandler — middleware Express de gestion des erreurs
 */
const errorHandler = (err, req, res, next) => {
  // Erreur opérationnelle (AppError, NotFoundError, Validation...)
  if (isOperationalError(err)) {
    logger.warn({ err }, 'App error');
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Erreur inattendue
  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export default errorHandler;
