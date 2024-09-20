function errorHandler(err, req, res, next) {
  console.error(err); // Log error for server-side tracing

  if (res.headersSent) {
      return next(err);
  }

  res.status(500).json({
      message: "An internal server error occurred",
      error: err.message
  });
}

module.exports = errorHandler;
