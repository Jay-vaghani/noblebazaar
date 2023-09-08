const mongoose = require("mongoose");
const Validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    validate: [Validator.isEmail, "please enter valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPassword: String,
  resetPasswordExpire: Date,
});

userSchema.methods.resetPasswordToken = function () {
  const randomBytes = crypto.randomBytes(20).toLocaleString("hex");

  const createHash = crypto
    .createHash("sha256")
    .update(randomBytes)
    .digest("hex");

  this.resetPassword = createHash;
  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return randomBytes;
};

const User = new mongoose.model("user", userSchema);

module.exports = User;
