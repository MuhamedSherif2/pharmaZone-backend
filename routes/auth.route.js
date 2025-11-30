const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");
const { authenticate } = require("../middleWars/auth.middlewar");

router.post("/register", auth.createUser('user'));
router.post("/login", auth.login);

// Password Recovery
router.post("/forgot-password", auth.forgotPassword);
router.post("/verify-otp", auth.verifyOTP);
router.post("/reset-password", auth.resetPassword);

module.exports = router;
