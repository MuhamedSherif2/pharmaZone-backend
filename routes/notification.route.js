const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// create Notification 
router.post("/create", notificationController.createNotification);

// getNotifications (User-Pharmacy) 
router.get("/", notificationController.getNotifications);

// markAsRead notifications

router.put("/read/:id", notificationController.markAsRead);

module.exports = router;
