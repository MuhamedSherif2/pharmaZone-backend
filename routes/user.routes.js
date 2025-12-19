import express from "express";
const router = express.Router();
import {
    getProfile,
    updatePassword,
    updateProfile
} from "../controllers/user.controller.js";
import { authenticate } from "../middleWars/auth.middlewar.js";

// All require login
router.get("/", authenticate, getProfile);
router.put("/update", authenticate, updateProfile);
router.put("/update-password", authenticate, updatePassword);

export default router;
