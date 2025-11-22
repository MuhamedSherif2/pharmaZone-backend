const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Create a new order
router.post("/create", orderController.createOrder);

// Get all orders of a user
router.get("/user/:userId", orderController.getOrdersByUser);

// Update order status
router.put("/update/:orderId", orderController.updateOrderStatus);

module.exports = router;
