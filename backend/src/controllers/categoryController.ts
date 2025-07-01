import { Request, Response } from "express";
import Category from "../models/Category";

export async function createCategory(req: Request, res: Response) {
  try {
    const category = new Category(req.body);
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      res.status(400).json({ error: "Category already exists" });
      return;
    }
    const savedCategory = await category.save();
    if (!savedCategory) {
      res.status(500).json({ error: "Failed to create category" });
      return;
    }
    res.status(201).json({ message: `Category created`, category: category });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
export async function updateCategory(req: Request, res: Response) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Category updated", category: category });
  } catch (err: any) {
    res.status(500).json({ error: err });
  }
}
export async function deleteCategory(req: Request, res: Response) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json({ message: `Category ${category.name} deleted` });
  } catch (err: any) {
    res.status(500).json({ error: err });
  }
}
