const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/errorHandler");
const AsyncErrorHandler = require("../middleware/asyncErrorHandler");
const { sendCookies } = require("../utils/sendCookie");
const { sendResetPassword } = require("../utils/sendEmail");
const crypto = require("crypto");

// **************************** REGISTER USER ****************************
exports.registerUser = AsyncErrorHandler(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar,
  });

  await sendCookies(res, user, "User Registered", 201);
});

// **************************** LOGIN USER ****************************
exports.userLogin = AsyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return next(new ErrorHandler(401, "Please enter credentials properly"));
  }

  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler(401, "Incorrect Credentials"));
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return next(new ErrorHandler(401, "Incorrect Credentials"));
  }

  await sendCookies(res, user, "User Logged In", 200);
});

// **************************** LOGIN OUT ****************************
exports.userLogout = AsyncErrorHandler(async (req, res, next) => {
  res.clearCookie("token", { sameSite: "None", secure: true });

  res.json({
    success: true,
    message: "Logout Successfully",
  });
});

// **************************** FORGOT PASSWORD ****************************
exports.forgotPassword = AsyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  const token = user.resetPasswordToken();

  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetpassword/${token}`;

  try {
    await sendResetPassword({
      name: user.name,
      email: user.email,
      subject: "Reset Password",
      resetPasswordUrl,
    });

    res.json({
      success: true,
      message: `Password reset email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPassword = undefined;

    await user.save();

    return next(new ErrorHandler(500, error.message));
  }
});

// **************************** RESET PASSWORD ****************************
exports.resetPassword = AsyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;

  const { newPassword, conformPassword } = req.body;
  const resetPassword = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPassword,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        400,
        "Reset password token is either invalid or expired "
      )
    );
  }

  if (newPassword !== conformPassword) {
    return next(new ErrorHandler(400, "Please enter same password"));
  }

  const password = await bcrypt.hash(newPassword, 12);

  user.password = password;
  user.resetPassword = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  await sendCookies(res, user, "Password Reset Successfully", 200);
});

// **************************** GET USER DETAILS ****************************
exports.getUserDetails = AsyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// **************************** UPDATE USER PASSWORD ****************************
exports.updatePassword = AsyncErrorHandler(async (req, res, next) => {
  const { oldPassword, newPassword, conformPassword } = req.body;

  if (newPassword !== conformPassword) {
    return next(new ErrorHandler(400, "Please enter same password"));
  }

  const user = await User.findById(req.user.id).select("+password");

  const comparePassword = await bcrypt.compare(oldPassword, user.password);

  if (!comparePassword) {
    return next(new ErrorHandler(401, "Incorrect old password"));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated",
  });
});

// **************************** UPDATE USER PROFILE ****************************
exports.updateProfile = AsyncErrorHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: name || req.user.name,
      email: email || req.user.email,
    },
    { returnDocument: "after" }
  );

  await sendCookies(res, user, "Profile Updated", 200);
});

// **************************** GET ALL USER DETAILS [ADMIN] ****************************
exports.getAllUser = AsyncErrorHandler(async (req, res, next) => {
  const allUsers = await User.find();

  res.status(200).json({
    success: true,
    allUsers,
  });
});

// **************************** GET SINGLE USER DETAILS [ADMIN] ****************************
exports.getSingleUserDetails = AsyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(404, "User not with this id"));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// **************************** UPDATE USER ROLL [ADMIN] ****************************
exports.updateUserRoll = AsyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(404, "User not with this id"));
  }

  user.role = user.role === "user" ? "admin" : "user";

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

// **************************** DELETE USER [ADMIN] ****************************
exports.deleteUser = AsyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorHandler(404, "User not with this id"));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
