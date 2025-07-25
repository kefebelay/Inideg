"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

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

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const res = await Axios.get(`/business/search?query=${searchQuery}`);
      setBusinesses(res.data.businesses);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchBusinesses();
  };

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

  const handleVerify = async (id: string, current: boolean) => {
    try {
      const res = await Axios.patch(`/business/${id}/verify`, {
        isVerified: !current,
      });
      setBusinesses((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, isVerified: res.data.business.isVerified } : b
        )
      );
      toast.success(
        `Business ${!current ? "verified" : "unverified"} successfully.`
      );
    } catch (err) {
      toast.error("Failed to update verification status.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-primary text-center">
        All Businesses
      </h1>

      {/* 🔍 Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-96">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={searching}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : businesses.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 text-lg">
          No businesses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card
              key={business._id}
              className="p-5 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              {business.profile?.[0] && (
                <img
                  src={business.profile[0]}
                  alt={business.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border"
                />
              )}
              <h2 className="text-xl font-semibold text-center">
                {business.name}
              </h2>
              <p className="text-center text-muted-foreground text-sm">
                {business.category?.name || "Uncategorized"}
              </p>
              <p className="text-center text-xs text-muted-foreground">
                {business.location?.city || "Unknown Location"}
              </p>
              <p className="text-center text-xs mt-1 text-muted-foreground">
                {business.views ?? 0} Views · {business.likes?.length ?? 0}{" "}
                Likes
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <select
                  value={business.isVerified ? "verified" : "unverified"}
                  onChange={async (e) => {
                    const newValue = e.target.value === "verified";
                    await handleVerify(business._id, !newValue);
                  }}
                  className="rounded border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  style={{ minWidth: 100 }}
                >
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
                <span className="text-xs">
                  {business.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-500">Unverified</span>
                  )}
                </span>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-1">
                Created:{" "}
                {business.createdAt
                  ? new Date(business.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <Button
                onClick={() => handleDelete(business._id)}
                className="w-full mt-4 bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
