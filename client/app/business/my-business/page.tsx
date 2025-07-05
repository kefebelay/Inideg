"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import Axios from "@/lib/axios";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Business {
  _id: string;
  name: string;
  profile: string[];
  category: { name: string };
  location: { address: string; city: string; coordinates: string };
  website?: string;
  contactEmail?: string;
  phone?: string;
  isVerified: boolean;
  description: string;
  views: number;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export default function MyBusinessPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"views" | "likes">("views");

  useEffect(() => {
    const fetchMyBusinesses = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await Axios.get(
          `/business/owner/${user._id}?page=${page}&limit=9`
        );
        setBusinesses(res.data.businesses || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError("Failed to fetch your businesses.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBusinesses();
  }, [user?._id, page]);

  // Filter businesses in-memory (if backend doesn't support sorting)
  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (filter === "views") {
      return b.views - a.views;
    } else {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this business?"))
      return;
    try {
      await Axios.delete(`/business/${id}`);
      setBusinesses((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete business.");
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-[--color-primary] tracking-tight text-center drop-shadow-sm">
        My Businesses
      </h1>
      <div className="flex gap-4 mb-8 justify-end">
        <button
          className={`px-5 py-2 rounded-full font-semibold shadow-sm transition-colors duration-200 border border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/50 ${
            filter === "views"
              ? "bg-[--color-primary] text-[--color-primary-foreground]"
              : "bg-[--color-card] text-[--color-primary] hover:bg-[--color-primary]/10"
          }`}
          onClick={() => setFilter("views")}
        >
          Sort by Views
        </button>
        <button
          className={`px-5 py-2 rounded-full font-semibold shadow-sm transition-colors duration-200 border border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]/50 ${
            filter === "likes"
              ? "bg-[--color-primary] text-[--color-primary-foreground]"
              : "bg-[--color-card] text-[--color-primary] hover:bg-[--color-primary]/10"
          }`}
          onClick={() => setFilter("likes")}
        >
          Sort by Likes
        </button>
      </div>
      {sortedBusinesses.length === 0 ? (
        <div className="text-[--color-muted-foreground] text-center text-lg py-16 bg-[--color-card]/60 rounded-xl shadow-inner">
          You have not created any businesses yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sortedBusinesses.map((business) => (
            <Card
              key={business._id}
              className="p-6 flex flex-col items-center bg-gradient-to-br from-[--color-card] via-[--color-background] to-[--color-primary]/10 rounded-2xl shadow-lg border border-[--color-border] hover:scale-[1.025] transition-transform duration-200"
            >
              {business.profile?.[0] && (
                <img
                  src={business.profile[0]}
                  alt={business.name}
                  className="w-28 h-28 object-cover rounded-full border-4 border-[--color-primary]/20 shadow mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-1 text-[--color-primary] text-center truncate w-full">
                {business.name}
              </h2>
              <p className="text-sm text-[--color-accent] mb-1 text-center">
                {business.category?.name || "Uncategorized"}
              </p>
              <p className="text-xs text-[--color-muted-foreground] mb-2 text-center">
                {business.location?.city}
              </p>
              <div className="flex gap-3 text-xs text-[--color-muted-foreground] mb-2">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-[--color-primary]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V10m9 0H6"
                    ></path>
                  </svg>
                  {business.views} Views
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-[--color-accent]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                    ></path>
                  </svg>
                  {business.likes?.length || 0} Likes
                </span>
              </div>
              <p className="text-xs text-[--color-muted-foreground] mt-2 text-center">
                Created: {new Date(business.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-[--color-muted-foreground] text-center mt-1">
                {business.isVerified ? (
                  <span className="text-green-600 font-semibold">Verified</span>
                ) : (
                  <span className="text-red-500 font-semibold">Unverified</span>
                )}
              </p>
              <button
                onClick={() => handleDelete(business._id)}
                className="mt-4 px-4 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
              >
                Delete
              </button>
            </Card>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-4 mt-12">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-5 py-2 rounded-full bg-[--color-muted] text-[--color-muted-foreground] font-semibold shadow disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg font-semibold text-[--color-primary]">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-5 py-2 rounded-full bg-[--color-muted] text-[--color-muted-foreground] font-semibold shadow disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
