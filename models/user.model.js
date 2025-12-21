import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String,
    unique: true,
    required: true,
  },
  phone: String,
  address: String,

  role: {
    type: String,
    enum: ["admin", "user", "pharmacy"],
    default: "user",
  }, 

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  passwordChangedAt: Date,

  // OTP system
  resetOTP: String,
  resetOTPExpires: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.correctPassword = async function (inputPass, hashedPass) {
  return await bcrypt.compare(inputPass, hashedPass);
};

// Check if password changed after JWT issued
userSchema.methods.changedPasswordAfter = function (jwtTime) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000);
    return jwtTime < changedTime;
  }
  return false;
};

// Create OTP
userSchema.methods.createPasswordResetOTP = function () {
  const otp = crypto.randomInt(100000, 1000000).toString();

  this.resetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return otp;
};

// module.exports = mongoose.model("User", userSchema);
export default mongoose.model("User", userSchema);