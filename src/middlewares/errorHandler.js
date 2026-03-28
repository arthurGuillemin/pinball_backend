const errorHandler = (err, req, res, next) => {
  console.error(err);
  // erreru zod
  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "fail",
      message: "data validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  // erreur custom
  if (err.statusCode) {
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
