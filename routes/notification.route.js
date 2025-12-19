import express from "express";
const router = express.Router();
import 
{
    createNotification,
    getNotifications,
    markAsRead
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleWars/auth.middlewar.js";

// create Notification 
router.post("/create",authenticate, createNotification);

// getNotifications (User-Pharmacy) 
router.get("/",authenticate, getNotifications);

// markAsRead notifications

router.put("/read/:id",authenticate, markAsRead);

export default router;
