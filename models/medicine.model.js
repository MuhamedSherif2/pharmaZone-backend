const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  //type: { type: String }, // tablet, syrup, injection...
  activeIngredient: { type: String },
  image: { type: String }, // URL of the medicine image
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Medicine", medicineSchema);
