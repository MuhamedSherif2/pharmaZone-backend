const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo DB Connected at Host: ${con.connection.host}`);
  } catch (err) {
    process.exit(1);
  }
};