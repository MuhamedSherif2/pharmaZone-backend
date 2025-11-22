const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: true
  },
  items: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // unit price
    }
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Delivered", "Cancelled"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
