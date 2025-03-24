import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import serverless from "serverless-http";
import connectDB from "./config/db";
import cloudinary from "./config/cloudinary";
import userRoutes from "./routes/users.routes";
import cartRoutes from "./routes/carts.routes";
import orderRoutes from "./routes/orders.routes";
import productRoutes from "./routes/products.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);

// Connect to MongoDB
connectDB();

// Cloudinary Test Route
app.get("/api/cloudinary-test", (req, res) => {
  res.json({
    cloudinaryConnected: !!cloudinary.config().cloud_name,
    message: "Cloudinary is configured!",
  });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(5000, () => {
  console.log('listening at 5000')
})

export default app;