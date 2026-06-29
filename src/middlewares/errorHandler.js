import logger from '../utils/logger.js';

/**
 * errorHandler — middleware Express de gestion centralisée des erreurs.
 * Doit être enregistré en dernier dans la chaîne de middlewares.
 *
 * 3 cas traités :
 *  1. Erreur de validation Zod → 400
 *  2. Erreur applicative AppError (avec statusCode) → statusCode
 *  3. Erreur inattendue → 500 (loggée en error pour investigation)
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

  // Erreur applicative intentionnelle (AppError)
  if (err.statusCode) {
    logger.warn({ message: err.message }, 'App error');
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Erreur inattendue — loggée pour investigation
  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export default errorHandler;
