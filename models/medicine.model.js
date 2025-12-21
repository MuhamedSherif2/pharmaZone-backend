import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String }, 
  description: { type: String },
  details: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("Medicine", medicineSchema);
