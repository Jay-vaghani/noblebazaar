const jwt = require("jsonwebtoken");

module.exports.sendCookies = async (res, user, message, statusCode = 200) => {
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // const cookieOptions =
  res
    .cookie("token", token, {
      sameSite: "None",
      secure: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    })
    .status(statusCode)
    .json({
      success: true,
      message,
      user,
    });
};
