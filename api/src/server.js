import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { conectToDB } from "./config/db.js";
import { notFound, errorHanlder } from "./middlewares/errors.middleware.js";

// Import routes
import authRoutes from "./features/auth/routes/auth.route.js";
import userRoutes from "./features/user/routes/user.route.js";
import wishlistRoutes from "./features/wishlist/routes/wishlist.route.js";
import adminRoutes from "./features/admin/routes/admin.route.js";
import productRoutes from "./features/product/routes/product.route.js";
import categoryRoutes from "./features/category/routes/category.route.js";
import cartRoutes from "./features/cart/routes/cart.route.js";
import paymentRoutes from "./features/payment/routes/payment.route.js";
import orderRoutes from "./features/order/routes/order.route.js";

// Express Usages
dotenv.config();

// Connection To Database
conectToDB();

// Init App
const app = express();

//Apply Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);

// Error Hander Middleware
app.use(notFound);
app.use(errorHanlder);

// Running the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(
    `Server is running successfully in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
