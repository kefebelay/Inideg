"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Folder, X } from "lucide-react";
import Axios from "@/lib/axios";
import { toast } from "react-toastify";

interface Category {
  _id: string;
  name: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await Axios.get("/category");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []);

  async function handleAddCategory() {
    if (name.trim() === "") return;

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const res = await Axios.post("/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newCategory = res.data.category;
      setCategories((prev) => [newCategory, ...prev]);
      toast.success("Category created");
      setName("");
      setImage(null);
    } catch (err) {
      toast.error("Failed to add category");
      console.error("Failed to add category", err);
    }
  }

  async function handleDeleteCategory(id: string) {
    try {
      await Axios.delete(`/category/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      toast.error("Failed to delete category");
      console.error("Failed to delete category", err);
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 bg-[--color-background] text-[--color-foreground]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
        </div>

        {/* Create Category */}
        <Card className="border border-[--color-border] bg-[--color-card] text-[--color-card-foreground] rounded-[--radius-lg]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5 text-[--color-primary]" />
              Create New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory();
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Input
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 w-36 bg-[--color-input] border-[--color-border] text-[--color-foreground]"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="bg-[--color-input] border-[--color-border] text-[--color-foreground] w-40"
              />
              <Button
                type="submit"
                className="bg-[--color-primary] text-[--color-primary-foreground] hover:cursor-pointer border border-[--color-primary]"
              >
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Categories */}
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground text-lg">
            Loading categories...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category._id}
                className="flex flex-col gap-2 p-4 border border-[--color-border] bg-[--color-card] text-[--color-card-foreground] rounded-[--radius-md] hover:shadow-md transition-shadow"
              >
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-destructive hover:bg-destructive/10 rounded-full cursor-pointer p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[--color-muted] text-[--color-primary]">
                    <Folder className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-base">{category.name}</h3>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
