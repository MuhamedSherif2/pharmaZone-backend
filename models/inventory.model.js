const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: true,
  },
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

// Ensure each pharmacy + medicine is unique
inventorySchema.index({ pharmacy: 1, medicine: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);
