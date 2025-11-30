const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authenticate } = require("../middleWars/auth.middlewar");

// create Notification 
router.post("/create",authenticate, notificationController.createNotification);

// getNotifications (User-Pharmacy) 
router.get("/",authenticate, notificationController.getNotifications);

// markAsRead notifications

router.put("/read/:id",authenticate, notificationController.markAsRead);

module.exports = router;
