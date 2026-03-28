class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = "fail";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
