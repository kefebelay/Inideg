import express from "express";
import mongoose from "mongoose";
import mainRouter from "./routes";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { createDefaultAdmin } from "./utils/createAdmin";
// import { createDefaultAdmin } from "./utils/createAdmin"; // Optional
// import "./cloudinary.config"; // Optional

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI_WEB || "";

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins: string[] = [
  "http://localhost:3000",
  "https://www.inideg.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/api", mainRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas database: inideg");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running `);
    });
    createDefaultAdmin();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
