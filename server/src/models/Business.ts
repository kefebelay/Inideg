import mongoose, { InferSchemaType, model } from "mongoose";
import { boolean } from "zod";

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number },
    isLiked: { type: Boolean, default: false },
    profile: { type: [String], required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: { type: String, required: true },
    },
    website: { type: String },
    contactEmail: { type: String },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);
type businesstype = InferSchemaType<typeof businessSchema>;
const Business = model<businesstype>("business", businessSchema);

export default Business;
