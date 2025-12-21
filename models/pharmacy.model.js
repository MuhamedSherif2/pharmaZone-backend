import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name:{type:String},
  isOpen24h: { type: Boolean, default: false },
  startTime: { type: String },
  endTime: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: { type: String },
  },

  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

pharmacySchema.index({ location: "2dsphere" });

// cascade delete pharmacy when user is deleted
pharmacySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await mongoose.model("Pharmacy").deleteMany({ userId: this._id });
    next();
  }
);


export default mongoose.model("Pharmacy", pharmacySchema);