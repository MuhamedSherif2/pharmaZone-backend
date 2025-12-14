const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Mongo DB Connected at Host: ${con.connection.host}`);
  } catch (err) {
    process.exit(1);
  }
};
