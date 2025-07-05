"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Axios from "@/lib/axios";

interface Business {
  _id: string;
  name: string;
  profile: string[];
  category?: { name: string };
  location?: { city: string };
  isVerified?: boolean;
  views?: number;
  likes?: string[];
  createdAt?: string;
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const res = await Axios.get("/business");
        setBusinesses(res.data.businesses || []);
      } catch (err) {
        setError("Failed to fetch businesses.");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

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
        All Businesses
      </h1>
      {businesses.length === 0 ? (
        <div className="text-[--color-muted-foreground] text-center text-lg py-16 bg-[--color-card]/60 rounded-xl shadow-inner">
          No businesses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {businesses.map((business) => (
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
                <span>{business.views ?? 0} Views</span>
                <span>{business.likes?.length ?? 0} Likes</span>
              </div>
              <p className="text-xs text-[--color-muted-foreground] mt-2 text-center">
                Created:{" "}
                {business.createdAt
                  ? new Date(business.createdAt).toLocaleDateString()
                  : "-"}
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
    </div>
  );
}
