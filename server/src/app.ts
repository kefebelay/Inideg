import express from "express";
import mongoose from "mongoose";
import mainRouter from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { createDefaultAdmin } from "./utils/createAdmin"; // Optional
// import "./cloudinary.config"; // Optional

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI_WEB || "";

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// API Routes
app.use("/api", mainRouter);

// --- Main Connection Logic ---
// Connect to MongoDB and start the server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas database: inideg");

    // Start listening for requests only after the DB connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process with an error code
  });
