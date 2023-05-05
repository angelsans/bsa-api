function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (error.status && error.message) {
    res.status(error.status);
    res.json({
      message: error.message,
      status: error.status,
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
    });
  }
}

module.exports = errorMiddleware;
