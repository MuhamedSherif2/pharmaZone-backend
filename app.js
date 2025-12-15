require("dotenv").config();
require("./config/db.js").connectDB();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;
const app = express();

const pharmacyRoutes = require("./routes/pharmacy.routes.js");
const inventoryRoutes = require("./routes/inventory.route.js");
const medicineRoutes = require("./routes/medicine.route.js");
const userRoutes = require("./routes/user.routes.js");
const authRoutes = require("./routes/auth.route.js");
const reviewRoutes = require("./routes/review.route.js");
const orderRoutes = require("./routes/order.route.js");
const notificationRoutes = require("./routes/notification.route.js");
const categoryRoutes=require("./routes/category.route.js")

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/review", reviewRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/order", orderRoutes);

app.use("/api/notification", notificationRoutes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Listening server error: ${err.message}`);
  } else {
    console.log(`Server listens at port: ${PORT}`);
  }
});
