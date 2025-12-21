import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// GET PROFILE
export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const fields = ["name", "email", "phone", "address"];
    const updates = {};

    fields.forEach((f) => {
      if (req.body[f]) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PASSWORD (must be logged in)
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isCorrect = await user.correctPassword(oldPassword, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Wrong old password" });

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, exclude password
    const users = await User.find({}, "-password");

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      results: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};