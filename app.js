require("dotenv").config();
require("./config/db.js").connectDB();
const express = require("express");
const PORT = process.env.PORT;
const app = express();


app.listen(PORT, (err) => {
  if (err) {
    console.log(`Listening server error: ${err.message}`);
  } else {
    console.log(`Server listens at port: ${PORT}`);
  }
});