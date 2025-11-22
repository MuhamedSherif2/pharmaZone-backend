const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.createuser = (role) => {
  return async (req, res) => {
    try {
      const { email, password, phone, address,name } = req.body;

      // ✅ التحقق من صحة الدور
      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ error: "invalid role" });
      }

      // ✅ التحقق من وجود البريد الإلكتروني مسبقًا
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email is exist" });
      }

      // ✅ التحقق من وجود الهاتف مسبقًا (اختياري)
      if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
          return res.status(400).json({ error: "Phone number already in use" });
        }
      }

      // ✅ إنشاء المستخدم
      const user = await User.create({ email, password, role, phone, address ,name});

      // ✅ إنشاء توكن JWT
      const token = jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET || "your-secret-key", // ✅ تصحيح الإملاء
        { expiresIn: "7d" }
      );

      // ✅ استخدام "data" بدلاً من "date"
      return res.status(201).json({ data: token });

    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ error: "user creation failed" });
    }
  };
};

// ✅ جلب معلومات المستخدم الحالي
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      user
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ✅ تحديث الملف الشخصي للمستخدم الحالي
exports.updateOwnProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ التحقق من تكرار البريد الإلكتروني إذا تم تحديثه
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: "Email already in use" });
    }

    // ✅ التحقق من تكرار الهاتف إذا تم تحديثه (اختياري)
    if (phone && phone !== user.phone) {
      const existing = await User.findOne({ phone });
      if (existing) return res.status(400).json({ error: "Phone number already in use" });
    }

    // ✅ تحديث الحقول فقط إذا كانت موجودة في الطلب
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    const updated = await User.findById(userId).select('-password');

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};