import User from "../models/user.model.js";
import Pharmacy from "../models/pharmacy.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOTPEmail } from "../services/mail.service.js";
import {
  createAccountSchema,
  createPharmacySchema,
  loginSchema,
  forgotPasswordSchema,
  verifySchema,
  resetPasswordSchema,
} from "../lib/validations/auth.js";

// Create JWT token
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// create account
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const formateUserData = {
      name,
      email,
      phone,
      role,
      password,
    };
    // Validate user data
    const validatedData = createAccountSchema.safeParse(formateUserData);

    if (!validatedData.success) {
      return res.status(400).json({
        errors: validatedData.error.flatten(),
      });
    }

    const userData = validatedData.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "البريد الإلكتروني مستخدم بالفعل" });
    }

    // Create user
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role,
    });

    // If role is pharmacy, create pharmacy document with userId
    if (userData.role === "pharmacy") {
      const { work24h, location, startTime, endTime } = req.body;
      const formatPharacyData = {
        isOpen24h: work24h,
        ...(work24h ? {} : { startTime, endTime }),
        location: {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
        },
      };

      const pharmacyData = createPharmacySchema.safeParse(formatPharacyData);

      if (!pharmacyData.success) {
        // first delete user created..
        await User.findByIdAndDelete({ _id: user._id });
        return res.status(400).json({
          errors: pharmacyData.error.flatten(),
        });
      }

      const pharmacyD = pharmacyData.data;

      await Pharmacy.create({
        userId: user._id,
        isOpen24h: pharmacyD.work24h,

        ...(pharmacyD.isOpen24h
          ? {}
          : { startTime: pharmacyD.startTime, endTime: pharmacyD.endTime }),

        location: {
          type: "Point",
          coordinates: [pharmacyD.location.lng, pharmacyD.location.lat],
          ...(pharmacyD.location.address
            ? { address: pharmacyD.location.address }
            : {}),
        },
      });
    }

    const token = signToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error, "error in create user functionality");
    res.status(500).json({ error: error });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    console.log(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const loginData = result.data;

    const user = await User.findOne({ email: loginData.email }).select(
      "+password"
    );
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const isCorrect = await user.correctPassword(password, user.password);
    if (!isCorrect)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = signToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FORGOT PASSWORD → send OTP
export const forgotPassword = async (req, res) => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    const data = result.data;

    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = user.createPasswordResetOTP();
    await user.save({ validateBeforeSave: false });

    // Send OTP to email
    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailError) {
      console.error("Failed to send email:", emailError.message);
      return res.status(500).json({
        message: "OTP created but failed to send email. Please try again.",
        emailError,
      });
    }

    res.json({ message: "OTP sent to your email successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const result = verifySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const otp = result.data.otp;

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      resetOTP: hashedOTP,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    // validate input
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }

    const { otp, password } = result.data;

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      resetOTP: hashedOTP,
      resetOTPExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = password;
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
