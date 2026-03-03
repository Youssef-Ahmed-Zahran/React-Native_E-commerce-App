import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { conectToDB } from "./config/db.js";

// Import routes

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
app.use("/", (req, res) => {
  res.send("Working Successfully!");
});

// Running the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(
    `Server is running successfully in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
