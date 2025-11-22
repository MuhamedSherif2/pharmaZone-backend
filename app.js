require("dotenv").config();
require("./config/db.js").connectDB();
const express = require("express");
const PORT = process.env.PORT;
const app = express();

const pharmacyRoutes = require("./routes/pharmacy.routes");
const inventoryRoutes = require("./routes/inventory.route.js");
const medicineRoutes = require("./routes/medicine.route.js");

app.use(express.json());

app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/medicine", medicineRoutes);

app.use("/register", require("./routes/user.routes.js"));
// تاكيد تسجيل دخول
app.use("/auth", require("./routes/auth.routes.js"));
app.use("/review", require("./routes/review.routes.js"));

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Listening server error: ${err.message}`);
  } else {
    console.log(`Server listens at port: ${PORT}`);
  }
});

/**

const pharmacyRoutes = require("./routes/pharmacy.routes");
 
app.use(express.json());
 
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/register", require("./routes/user.routes.js"));
// تاكيد تسجيل دخول
app.use("/auth", require("./routes/auth.routes.js"));
app.use("/review", require("./routes/review.routes.js"));
 
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Listening server error: ${err.message}`);
  } else {
    console.log(`Server listens at port: ${PORT}`);
  }
});
  */