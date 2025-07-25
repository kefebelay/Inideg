import { Request, Response } from "express";
import Category from "../models/Category";
import Like from "../models/Like";
import {
  decorateBusiness,
  decorateBusinesses,
} from "../utils/decorateBusiness";
import Business from "../models/Business";
import fs from "fs";
import cloudinary from "../cloudinary.config";

export async function createBusiness(req: Request, res: Response) {
  try {
    const existingBusiness = await Business.findOne({
      name: req.body.name,
    });
    if (existingBusiness) {
      res.status(400).json({ error: "Business already exists" });
      return;
    }
    const files = req.files as Express.Multer.File[];
    const uploadedImages: string[] = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "business_profiles",
      });

      uploadedImages.push(result.secure_url);

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Failed to delete local file:", file.path, err);
        }
      });
    }

    const business = new Business({
      ...req.body,
      profile: uploadedImages,
      likes: [],
    });

    const savedBusiness = await business.save();

    if (!savedBusiness) {
      res.status(500).json({ error: "Failed to create business" });
      return;
    }

    res
      .status(201)
      .json({ message: "Business created", business: savedBusiness });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getBusinesses(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;

    const businesses = await Business.find()
      .populate("owner")
      .populate("category")
      .lean();

    const decorated = decorateBusinesses(businesses, userId);

    res.status(200).json({
      message: "Businesses fetched",
      businesses: decorated,
    });
  } catch (err: any) {
    console.error("getBusinesses error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getBusiness(req: Request, res: Response) {
  try {
    const { userId } = req.query;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("owner")
      .populate("category")
      .lean();

    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }

    const isLiked = Boolean(
      userId && business.likes?.some((id: any) => id.toString() === userId)
    );

    res.status(200).json({
      message: "Business fetched",
      business: {
        ...business,
        isLiked,
        likes: business.likes?.map((id: any) => id.toString()) || [],
      },
    });
  } catch (err: any) {
    console.error("GetBusiness error:", err);
    res.status(500).json({ error: err.message });
  }
}
export async function getBusinessAndIncrementViews(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.query;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("owner")
      .populate("category")
      .lean();

    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }

    const isLiked =
      userId && business.likes?.some((id: any) => id.toString() === userId);

    res.status(200).json({
      message: "Business fetched",
      business: {
        ...business,
        isLiked: Boolean(isLiked),
        likes: business.likes.map((id: any) => id.toString()),
      },
    });
  } catch (err: any) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBusiness(req: Request, res: Response) {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }
    res
      .status(200)
      .json({ message: `Business ${business.name} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getMyBusiness(req: Request, res: Response) {
  try {
    const businesses = await Business.find({ owner: req.params.ownerId })
      .populate("owner")
      .populate("category")
      .populate("likes");
    if (!businesses || businesses.length === 0) {
      res.status(404).json({ error: "No businesses found" });
      return;
    }
    res.status(200).json({ message: "Businesses fetched", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getMostViewedBusinesses(req: Request, res: Response) {
  try {
    const businesses = await Business.find()
      .sort({ views: -1 })
      .populate("owner")
      .populate("category")
      .populate("likes");
    res.status(200).json({ message: "Most viewed businesses", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getMostLikedBusinesses(req: Request, res: Response) {
  try {
    const businesses = await Business.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $sort: { likesCount: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
    ]);

    res.status(200).json({ message: "Most liked businesses", businesses });
  } catch (err: any) {
    console.error("Most Liked Businesses Error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getMostCommentedBusinesses(req: Request, res: Response) {
  try {
    const businesses = await Business.find()
      .sort({ comments: -1 })
      .populate("owner")
      .populate("category")
      .populate("likes");
    res.status(200).json({ message: "Most commented businesses", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getBusinessByCategory(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    const { categoryId } = req.params;

    const items = await Business.find({ category: categoryId })
      .populate("owner")
      .populate("category")
      .lean();

    if (!items || items.length === 0) {
      res.status(404).json({ error: "No items found in this category" });
      return;
    }

    const decorated = items.map((item) => {
      const likeIds = item.likes?.map((id: any) => id.toString()) || [];
      return {
        ...item,
        isLiked: userId ? likeIds.includes(userId.toString()) : false,
        likes: likeIds,
      };
    });

    res.status(200).json({
      message: "Items fetched",
      businesses: decorated,
    });
  } catch (err: any) {
    console.error("getBusinessByCategory error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function searchBusinesses(req: Request, res: Response) {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Invalid search query" });
      return;
    }
    const businesses = await Business.find({
      name: { $regex: query, $options: "i" },
    })
      .populate("owner")
      .populate("category")
      .populate("likes");
    res.status(200).json({ message: "Search results", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getBusinessByOwner(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;
    const ownerId = req.params.ownerId;

    const businesses = await Business.find({ owner: ownerId })
      .populate("owner")
      .populate("category")
      .populate("likes")
      .lean();

    const decorated = decorateBusinesses(businesses, userId);

    res
      .status(200)
      .json({ message: "Owner's businesses", businesses: decorated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
import mongoose from "mongoose";

export async function toggleBusinessLike(req: Request, res: Response) {
  try {
    const { businessId, userId } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId); //
    const alreadyLiked = business.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      business.likes = business.likes.filter((id) => id.toString() !== userId);
    } else {
      business.likes.push(userObjectId);
    }

    await business.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
    });
  } catch (err: any) {
    console.error("Toggle Like Error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getBusinessesUserLikes(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    const businesses = await Business.find({ likes: userId })
      .populate("owner")
      .populate("category")
      .populate("likes");

    res.status(200).json({ message: "User's liked businesses", businesses });
  } catch (err: any) {
    console.error("Get User Liked Businesses Error:", err);
    res.status(500).json({ error: err.message });
  }
}
export const verifyBusiness = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  try {
    const business = await Business.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    );

    if (!business) {
      res.status(404).json({ message: "Business not found" });
      return;
    }

    res.status(200).json({
      message: "Business verification status updated",
      business,
    });
  } catch (error) {
    console.error("Verification update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
