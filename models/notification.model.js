import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: false
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: false
  },
  title: { type: String, required: true },
  message: { type: String, required: true },

  type: {
    type: String,
    enum: ["order", "system", "warning", "pharmacy", "general"],
    default: "general"
  },

  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);