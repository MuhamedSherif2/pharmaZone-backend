const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const signtoken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET, // ✅ تأكد من استخدام الاسم الصحيح
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  )
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email); // ✅ تسجيل
      return res.status(404).json({ error: "email or password invalid" });
    }

    console.log("User found:", user.email); // ✅ تسجيل
    console.log("Password in DB:", user.password); // ✅ تسجيل

    const iscorrect = await user.correctPassword(password);
    console.log("Password comparison result:", iscorrect); // ✅ تسجيل

    if (iscorrect) {
      const token = signtoken(user);

      return res.status(200).json({
        message: "login successfully",
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
    return res.status(400).json({ error: "email or password invilid" });
  } catch (err) {
    console.error("Login error:", err); // ✅ تسجيل الخطأ
    return res.status(500).json({ error: err.message });
  }
};