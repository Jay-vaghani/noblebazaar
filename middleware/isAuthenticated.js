const User = require("../model/userModel");
const AsyncErrorHandler = require("../middleware/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");

module.exports.isAuthenticated = AsyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler(401, "Please Login"));
  }

  const decodeCookie = jwt.verify(token, process.env.JWT_SECRETE);

  req.user = await User.findById(decodeCookie.id);

  next();
});

exports.authorizedRoles = (roles) => {
  return (req, res, next) => {
    console.log();

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          401,
          `Roll: ${req.user.role}  is not allowed to access`
        )
      );
    }
    next();
  };
};
