"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Axios from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const CategoryItemsPage: React.FC = () => {
  interface Item {
    _id: string;
    name: string;
    description: string;
    profile?: string[];
    category?: { name: string };
    likes: string[];
    isLiked: boolean;
  }

  const params = useParams();
  const categoryId = params?.id as string;
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [liking, setLiking] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await Axios.get(
        `/business/category/${categoryId}?page=${page}&limit=9&userId=${userId}`
      );
      setItems(res.data.businesses || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err: any) {
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) fetchItems();
  }, [categoryId, page, userId]);

  const handleLike = async (businessId: string) => {
    if (!userId) {
      toast.info("Please log in to like.");
      return;
    }

    setLiking(businessId);

    try {
      await Axios.post("/business/toggle-like", { businessId, userId });
      fetchItems();
    } catch (err) {
      console.error("Like failed:", err);
      toast.error("Something went wrong while liking.");
    } finally {
      setLiking(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10 mt-20">
        <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary inline-block"></span>
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Category Items
      </h1>
      {items.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No items found in this category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="relative bg-card text-card-foreground rounded-xl shadow hover:shadow-md transition-all overflow-hidden border border-border"
              >
                <Link href={`/biz/${item._id}`} className="block">
                  <img
                    src={item.profile![0]}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-1">
                    <h2 className="text-lg font-semibold truncate">
                      {item.name}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>

                {/* Like button */}
                <Button
                  onClick={() => handleLike(item._id)}
                  variant="ghost"
                  className="absolute top-4 right-4 text-xl text-red-500 z-10 dark:bg-black/90 bg-black/40 cursor-pointer rounded-full p-2 shadow"
                  disabled={liking === item._id}
                >
                  {item.isLiked ? <FaHeart /> : <FaRegHeart />}
                  <span className="ml-1 text-sm text-foreground">
                    {item.likes.length}
                  </span>
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryItemsPage;
