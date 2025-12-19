import express from "express";
const router = express.Router();
import 
{
    createUser,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword
} from "../controllers/auth.controller.js";
// const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// router.post("/register", auth.createUser(''));
//  router.post("/admin",authenticate,authorize('admin'), auth.createUser('admin'));

router.post("/register", createUser);

router.post("/login", login);

// Password Recovery
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
