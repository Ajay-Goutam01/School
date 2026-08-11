const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.code === "LIMIT_FILE_SIZE"
      ? 413
      : res.statusCode === 200
        ? 500
        : res.statusCode;
  console.error(
    `[Error Handler] ${req.method} ${req.originalUrl}:`,
    err.message,
  );
  const message =
    err.code === "LIMIT_FILE_SIZE"
      ? "Uploaded file exceeds the allowed size limit."
      : process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
