const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin','user'],
  },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});
 

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
 
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
 
module.exports = mongoose.model("User", userSchema);