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
      .populate("category");
    res.status(200).json({ message: "Businesses fetched", businesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
export async function getBusiness(req: Request, res: Response) {
  try {
    const business = await Business.findById(req.params.id)
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
      .populate("category");
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
