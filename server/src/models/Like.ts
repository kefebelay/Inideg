import { Schema, InferSchemaType, model } from "mongoose";

const LikeSchema = new Schema(
  {
    userId: { type: String, required: true },
    businessId: { type: String, required: true },
    liked: { type: Boolean, default: true },
  },
  { timestamps: true }
);

type LikeType = InferSchemaType<typeof LikeSchema>;

const Like = model<LikeType>("like", LikeSchema);

export default Like;
