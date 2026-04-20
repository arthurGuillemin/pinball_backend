const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL: 500,
};

class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {{ cause?: Error, details?: Record<string, unknown> }} [options]
   */
  constructor(message, statusCode, { cause, details } = {}) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? 'error' : 'fail';
    this.isOperational = true;
    this.details = details ?? null;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      ...(this.details && { details: this.details }),
    };
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request', options) {
    super(message, HTTP_STATUS.BAD_REQUEST, options);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', options) {
    super(message, HTTP_STATUS.UNAUTHORIZED, options);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', options) {
    super(message, HTTP_STATUS.FORBIDDEN, options);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', options) {
    super(message, HTTP_STATUS.NOT_FOUND, options);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict', options) {
    super(message, HTTP_STATUS.CONFLICT, options);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', options) {
    super(message, HTTP_STATUS.UNPROCESSABLE, options);
  }
}

class InternalError extends AppError {
  constructor(message = 'Internal server error', options) {
    super(message, HTTP_STATUS.INTERNAL, options);
  }
}

/** @param {unknown} err */
const isOperationalError = (err) =>
  err instanceof AppError && err.isOperational;

export default {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalError,
  isOperationalError,
};
