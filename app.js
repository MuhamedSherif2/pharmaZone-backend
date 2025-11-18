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

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Listening server error: ${err.message}`);
  } else {
    console.log(`Server listens at port: ${PORT}`);
  }
});