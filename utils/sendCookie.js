const jwt = require("jsonwebtoken");

module.exports.sendCookies = (res, user, message, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    secure: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    domain: "https://noblebazaar.onrender.com",
  };
  res.cookie("token", token, cookieOptions).status(statusCode).json({
    success: true,
    message,
    user,
  });
};
