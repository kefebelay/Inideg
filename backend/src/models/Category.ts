import { Schema, InferSchemaType, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);
type categoryType = InferSchemaType<typeof categorySchema>;
const Category = model<categoryType>("category", categorySchema);
export default Category;
