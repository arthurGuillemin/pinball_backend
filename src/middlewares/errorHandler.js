import logger from '../utils/logger.js';
import { isOperationalError } from '../utils/appError.js';

/**
 * errorHandler — middleware Express de gestion centralisée des erreurs.
 */
const errorHandler = (err, req, res, next) => {
  // Erreur de validation Zod
  if (err.name === 'ZodError') {
    const errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    logger.warn({ errors }, 'Validation error');

    return res.status(400).json({
      status: 'fail',
      message: 'Erreur de validation des données',
      errors,
    });
  }

  // Erreur applicative opérationnelle (AppError, NotFoundError, etc.)
  if (isOperationalError(err)) {
    logger.warn({ err }, 'App error');
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Erreur inattendue — loggée en error car potentiellement un vrai bug
  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export default errorHandler;
