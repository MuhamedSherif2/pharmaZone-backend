const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, lowercase: true },
  password: { type: String, required: true },
  workingHours: { type: String },
  isOpen24h: { type: Boolean, default: false },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

pharmacySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Pharmacy", pharmacySchema);
