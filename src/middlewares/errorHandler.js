import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  // erreru zod
  if (err.name === "ZodError") {
    const errors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    logger.warn({ errors }, "Validation error");

    return res.status(400).json({
      status: "fail",
      message: "data validation error",
      errors,
    });
  }
  // erreur custom
  if (err.statusCode) {
    logger.warn({ message: err.message }, "App error");
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }
  // erreur inconnue
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};

export default errorHandler;
