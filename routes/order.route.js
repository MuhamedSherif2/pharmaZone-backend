import express from "express";
const router = express.Router();
import 
{
    createOrder,
    getOrdersByUser,
    updateOrderStatus
} from "../controllers/order.controller.js";
import { authenticate, authorize } from "../middleWars/auth.middlewar.js";

// Create a new order
router.post("/create",authenticate, createOrder);

// Get all orders of a user
router.get("/user/:userId",authenticate, getOrdersByUser);

// Update order status
router.put("/update/:orderId", authenticate,authorize('pharmacy') ,updateOrderStatus);

export default router;
