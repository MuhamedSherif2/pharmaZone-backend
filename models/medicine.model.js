
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  activeIngredient: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Medicine", medicineSchema);
