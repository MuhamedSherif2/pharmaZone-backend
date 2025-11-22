const express = require("express");
const router = express.Router();
 
// ✅ استيراد دوال التحكم بشكل صحيح
const { createuser, getUser } = require("../controllers/user.controller");
const { login } = require("../controllers/auth.controller");
 
// const { authenticate } = require("../middleware/auth.middleware");
// const { authorize } = require("../middleware/role.middleware");
 
// ✅ POST / → إنشاء مستخدم جديد (بدون مصادقة، كما تفضلت)
router.post("/", createuser("user")); // ← هذا يُرجع الدالة الداخلية
 
// ✅ GET / → جلب المستخدمين (مع مصادقة، حسب الحاجة)
router.get("/", getUser);
 
// {
//   "name": "aya salah",
//   "email": "aumenya@example.com",
//   "password": "password123",
//   "role": "user",
//   "phone": "8888",
//   "address": "123 Main St, Cairo"
// }
 

 
// ligon  تاكيد تسجيل دخول
router.post("/login", login);
module.exports = router;