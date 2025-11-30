const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middleWars/auth.middlewar");

// Create a new order
router.post("/create",authenticate, orderController.createOrder);

// Get all orders of a user
router.get("/user/:userId",authenticate, orderController.getOrdersByUser);

// Update order status
router.put("/update/:orderId", authenticate,authorize('admin'),orderController.updateOrderStatus);

module.exports = router;
