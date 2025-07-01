import { Request, Response } from "express";
import Category from "../models/Category";
import cloudinary from "../cloudinary.config";
import streamifier from "streamifier";

export async function createCategory(req: Request, res: Response) {
  try {
    const { name } = req.body;
    console.log(process.env.API_KEY);

    if (!name) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      res.status(409).json({ error: "Category already exists" });
      return;
    }

    let imageUrl: string | undefined;

    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "categories" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file!.buffer).pipe(stream);
        });

      const result: any = await streamUpload();
      imageUrl = result.secure_url;
    }

    const category = new Category({ name: name.trim(), image: imageUrl });
    const saved = await category.save();

    res.status(201).json({ message: "Category created", category: saved });
  } catch (err: any) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function getCategories(req: Request, res: Response) {
  try {
    const category = await Category.find();
    res
      .status(200)
      .json({ message: "Categories fetched", categories: category });
  } catch (err: any) {
    res.status(500).json({ error: err });
  }
}
export async function getCategory(req: Request, res: Response) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Category fetched", category: category });
  } catch (err: any) {
    res.status(500).json({ error: err });
  }
}
export async function deleteCategory(req: Request, res: Response) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    if (category.image) {
      const urlSegments = category.image.split("/");
      const publicIdWithExtension = urlSegments.slice(-2).join("/");
      const publicId = publicIdWithExtension.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: `Category '${category.name}' and its image have been deleted.`,
    });
  } catch (err: any) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: "Server error during deletion." });
  }
}
