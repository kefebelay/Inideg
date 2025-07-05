"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Axios from "@/lib/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

type Business = {
  _id: string;
  name: string;
  profile: string[];
  category: { name: string };
  location: { city: string };
  likes: string[]; // Array of user IDs
};

export default function BusinessListPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?._id;
  const [liking, setLiking] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await Axios.get(`/business?page=${page}&limit=9`);
        setBusinesses(res.data.businesses || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
      }
    };

    fetchBusinesses();
  }, [page]);

  const handleLike = async (businessId: string) => {
    if (!userId) return;
    setLiking(businessId);
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b._id !== businessId) return b;
        const liked = b.likes.includes(userId);
        return {
          ...b,
          likes: liked
            ? b.likes.filter((id) => id !== userId)
            : [...b.likes, userId],
        };
      })
    );
    try {
      await Axios.post("/business/toggle-like", { businessId, userId });
    } catch (err) {
      // Revert on error
      setBusinesses((prev) =>
        prev.map((b) => {
          if (b._id !== businessId) return b;
          const liked = b.likes.includes(userId);
          return {
            ...b,
            likes: liked
              ? b.likes.filter((id) => id !== userId)
              : [...b.likes, userId],
          };
        })
      );
    } finally {
      setLiking(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-[--color-foreground]">
        All Businesses
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {businesses.map((business) => {
          const isLiked = business.likes?.some((u: any) => u._id === user?._id);
          return (
            <div
              key={business._id}
              className="relative bg-[--color-card] text-[--color-card-foreground] rounded-2xl shadow-lg hover:shadow-2xl transition-all p-0 overflow-hidden group border border-[--color-border]"
            >
              <Link href={`/businesses/${business._id}`} className="block">
                <img
                  src={business.profile?.[0] || "/placeholder.jpg"}
                  alt={business.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-1 truncate">
                    {business.name}
                  </h2>
                  <p className="text-sm text-[--color-muted-foreground] mb-1">
                    {business.location.city}
                  </p>
                  <p className="text-xs text-[--color-accent-foreground] mb-2">
                    {business.category?.name || "Uncategorized"}
                  </p>
                </div>
              </Link>
              <button
                className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition z-10 flex items-center gap-1"
                onClick={() => handleLike(business._id)}
                disabled={liking === business._id}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                {isLiked ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-xl" />
                )}
                <span className="text-xs text-gray-700 ml-1">
                  {business.likes?.length || 0}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
