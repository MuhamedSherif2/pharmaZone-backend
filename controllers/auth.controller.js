const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Create JWT token
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN  }
  );
};

// REGISTER 
exports.createUser =(role) => {
  return async (req, res) => {
    try {
      const { email, password, phone, address, name } = req.body;

      // Validate role
      if (![ "user","admin","pharmacy"].includes(role)) {
        return res.status(400).json({ error: "invalid role" });
      }

      // Email exists?
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Phone exists?
      if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
          return res.status(400).json({ error: "Phone number already in use" });
        }
      }

      // Create user
      const user = await User.create({
        email,
        password,
        role,
        phone,
        address,
        name
      });

      // Generate token
      const token = signToken(user);

      // Response
      return res.status(201).json({
        message: "User created successfully",
        token
      });

    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ error: "User creation failed" });
    }
  };
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "Invalid email or password" });

    const isCorrect = await user.correctPassword(password, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Invalid email or password" });

    const token = signToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FORGOT PASSWORD → send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    // => "send email"
    console.log("OTP:", otp);

    res.json({ message: "OTP sent to email", otp }); // return otp for testing
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const hashedOTP = crypto.createHash("sha256").update(req.body.otp).digest("hex");

    const user = await User.findOne({
      resetOTP: hashedOTP,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const hashedOTP = crypto.createHash("sha256").update(req.body.otp).digest("hex");

    const user = await User.findOne({
      resetOTP: hashedOTP,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = req.body.password;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    const token = signToken(user);

    res.json({ message: "Password reset successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
