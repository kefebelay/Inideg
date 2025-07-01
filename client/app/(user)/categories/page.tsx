"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Axios from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  image: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
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

  return (
    <section className="mt-28 pb-16 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center mb-10 text-primary">
        Explore Categories
      </h2>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No categories found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat._id}`}
              className="group block rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
