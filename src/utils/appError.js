const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL: 500,
};

export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=500]
   * @param {{ cause?: Error, details?: Record<string, unknown> }} [options]
   */
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL,
    { cause, details } = {}
  ) {
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

export const isOperationalError = (err) =>
  err instanceof AppError && err.isOperational;

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', options) {
    super(message, HTTP_STATUS.NOT_FOUND, options);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', options) {
    super(message, HTTP_STATUS.CONFLICT, options);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', options) {
    super(message, HTTP_STATUS.UNPROCESSABLE, options);
  }
}

export class InternalError extends AppError {
  constructor(message = 'Internal server error', options) {
    super(message, HTTP_STATUS.INTERNAL, options);
  }
}
