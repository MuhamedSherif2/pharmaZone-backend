// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import corsMiddleware from "./middleWars/cors.middleware.js";
// import connectDB from "./config/db.js";
// /////


// const app = express();
// connectDB();
// import cors from "cors";

// app.use(express.json());
// app.use(corsMiddleware);
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import corsMiddleware from "./middleWars/cors.middleware.js";
import { connectDB } from "./config/db.js";

const app = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(corsMiddleware);

const PORT =process.env.PORT


import pharmacyRoutes from "./routes/pharmacy.routes.js";
import inventoryRoutes from "./routes/inventory.route.js";
import medicineRoutes from"./routes/medicine.route.js";
import userRoutes from"./routes/user.routes.js";
import authRoutes from"./routes/auth.route.js";
import reviewRoutes from"./routes/review.route.js";
import orderRoutes from"./routes/order.route.js";
import notificationRoutes from"./routes/notification.route.js";
import categoryRoutes from"./routes/category.route.js";

app.use(express.json());

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
