import express from "express";
const router = express.Router();
import {
    getAllUsers,
    getProfile,
    updatePassword,
    updateProfile
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleWars/auth.middlewar.js";

// All require login
router.get("/", authenticate, getProfile);
router.put("/update", authenticate, updateProfile);
router.put("/update-password", authenticate, updatePassword);
router.get("/allUsers",authenticate,authorize('admin'),getAllUsers)

export default router;
