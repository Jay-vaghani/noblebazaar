const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  // ********** WRONG MONGODB ID ERROR **********

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;

    err = new ErrorHandler(400, message);
  }

  // ********** DUPLICATE KEY ERROR **********

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;

    err = new ErrorHandler(400, message);
  }

  // ********** JWT TOKEN ERROR **********

  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid please try again`;

    err = new ErrorHandler(400, message);
  }

  // ********** JWT TOKEN ERROR **********

  if (err.name === "TokenExpireError") {
    const message = `Json web token is expire please try again`;

    err = new ErrorHandler(400, message);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
