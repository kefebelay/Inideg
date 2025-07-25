import express from "express";
import mongoose from "mongoose";
import mainRouter from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createDefaultAdmin } from "./utils/createAdmin";
import "./cloudinary.config";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", mainRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, async () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      await createDefaultAdmin();
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
