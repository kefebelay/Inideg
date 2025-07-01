import mongoose, { InferSchemaType, model } from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },
    views: { type: Number, default: 0 },
    profile: { type: String },
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
      ref: "Category",
    },
  },
  { timestamps: true }
);
type businesstype = InferSchemaType<typeof businessSchema>;
const Business = model<businesstype>("business", businessSchema);

export default Business;
