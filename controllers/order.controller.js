import Order from "../models/order.model.js";
import Inventory from "../models/inventory.model.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { user, pharmacy, items } = req.body;

    if (!user || !pharmacy || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "User, pharmacy and items are required" });
    }

    // Calculate totalPrice and check inventory
    let totalPrice = 0;
    for (let item of items) {
      const inventory = await Inventory.findOne({ pharmacy, medicine: item.medicine, quantity: { $gte: item.quantity } });
      if (!inventory) {
        return res.status(400).json({ success: false, message: `Medicine ${item.medicine} is out of stock or insufficient quantity` });
      }
      totalPrice += inventory.price * item.quantity;
    }

    // Create order
    const order = new Order({ user, pharmacy, items, totalPrice });
    await order.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders of a user
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("pharmacy")
      .populate("items.medicine");

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Accepted", "Rejected", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status, updatedAt: Date.now() }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
