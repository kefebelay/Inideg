import { Request, Response } from "express";
import Business from "../models/Business";

export async function createBusiness(req: Request, res: Response) {
  try {
    const business = new Business(req.body);
    const existingBusiness = await Business.findOne({
      name: business.name,
      owner: business.owner,
    });
    if (existingBusiness) {
      res.status(400).json({ error: "Business already exists" });
      return;
    }
    const savedBusiness = await business.save();
    if (!savedBusiness) {
      res.status(500).json({ error: "Failed to create business" });
      return;
    }
    res
      .status(201)
      .json({ message: "Business created", business: savedBusiness });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getBusinesses(req: Request, res: Response) {
  try {
    const businesses = await Business.find()
      .populate("owner")
      .populate("category")
      .populate("like");
    res.status(200).json({ message: "Businesses fetched", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getBusiness(req: Request, res: Response) {
  try {
    const business = await Business.findById(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("owner")
      .populate("category");
    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }
    res.status(200).json({ message: "Business fetched", business });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function updateBusiness(req: Request, res: Response) {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("owner")
      .populate("category")
      .populate("like");
    if (!business) {
      res.status(404).json({ error: "Business not found" });
      return;
    }
    res.status(200).json({ message: "Business updated", business });
  } catch (err: any) {
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
      .populate("like");
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
      .sort({ views: -1 }) // Descending
      .populate("owner")
      .populate("category")
      .populate("like");
    res.status(200).json({ message: "Most viewed businesses", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getMostLikedBusinesses(req: Request, res: Response) {
  try {
    const businesses = await Business.find()
      .sort({ likes: -1 })
      .populate("owner")
      .populate("category")
      .populate("like");
    res.status(200).json({ message: "Most liked businesses", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getMostCommentedBusinesses(req: Request, res: Response) {
  try {
    const businesses = await Business.find()
      .sort({ comments: -1 }) // Descending
      .populate("owner")
      .populate("category")
      .populate("like");
    res.status(200).json({ message: "Most commented businesses", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getBusinessByCategory(req: Request, res: Response) {
  try {
    const businesses = await Business.find({ category: req.params.categoryId })
      .populate("owner")
      .populate("category")
      .populate("like");
    if (!businesses || businesses.length === 0) {
      res.status(404).json({ error: "No businesses found in this category" });
      return;
    }
    res.status(200).json({ message: "Businesses fetched", businesses });
  } catch (err: any) {
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
      .populate("like");
    res.status(200).json({ message: "Search results", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getBusinessByOwner(req: Request, res: Response) {
  try {
    const businesses = await Business.find({ owner: req.params.ownerId })
      .populate("owner")
      .populate("category")
      .populate("like");
    if (!businesses || businesses.length === 0) {
      res.status(404).json({ error: "No businesses found for this owner" });
      return;
    }
    res.status(200).json({ message: "Businesses fetched", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
