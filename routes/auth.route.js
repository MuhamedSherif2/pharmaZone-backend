const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");
// const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// router.post("/register", auth.createUser(''));
//  router.post("/admin",authenticate,authorize('admin'), auth.createUser('admin'));

router.post("/register", auth.createUser);

router.post("/login", auth.login);

// Password Recovery
router.post("/forgot-password", auth.forgotPassword);
router.post("/verify-otp", auth.verifyOTP);
router.post("/reset-password", auth.resetPassword);

module.exports = router;
