import { Request, Response } from "express";
import Like from "../models/Like";

export async function likeBusiness(req: Request, res: Response) {
  const { userId, businessId } = req.body;

  try {
    const existingLike = await Like.findOne({ userId, businessId });

    if (existingLike) {
      existingLike.liked = !existingLike.liked;
      await existingLike.save();
      res
        .status(200)
        .json({ message: "Like status toggled", like: existingLike });
      return;
    } else {
      const newLike = new Like({ userId, businessId });
      await newLike.save();
      res.status(201).json({ message: "Business liked", like: newLike });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
export async function getLikedBusinesses(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const likes = await Like.find({ userId, liked: true }).populate(
      "businessId"
    );
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
