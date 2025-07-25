"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Business = {
  _id: string;
  name: string;
  profile: string[];
  category: { name: string };
  location: { city: string; address: string };
  likes: string[];
  isLiked: boolean;
};

export default function BusinessListPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [liking, setLiking] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?._id;

  useEffect(() => {
    fetchBusinesses();
  }, [page, userId]);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(
        `/business?page=${page}&limit=9&userId=${userId}`
      );
      setBusinesses(res.data.businesses || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get(
        `/business/search?query=${encodeURIComponent(
          searchQuery
        )}&userId=${userId}`
      );
      setBusinesses(res.data.businesses || []);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchBusinesses();
  };

  const handleLike = async (businessId: string) => {
    if (!userId) {
      toast.info("Please log in to like a business.");
      return;
    }

    setLiking(businessId);
    try {
      await axios.post("/business/toggle-like", { businessId, userId });
      await fetchBusinesses();
    } catch (err) {
      console.error("Like failed:", err);
      toast.error("Something went wrong while liking.");
    } finally {
      setLiking(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        All Businesses
      </h1>
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-96">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={searching} variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          {searchQuery && (
            <Button onClick={handleClearSearch} variant="ghost" type="button">
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {businesses.length === 0 && searchQuery ? (
          <p className="col-span-full text-center text-lg text-muted-foreground py-16">
            Business "{searchQuery}" doesn't exist.
          </p>
        ) : (
          businesses.map((business) => (
            <div
              key={business._id}
              className="relative bg-card text-card-foreground rounded-xl shadow hover:shadow-lg hover:transition-transform hover:scale-101 transition-all overflow-hidden border border-border"
            >
              <Link href={`/businesses/${business._id}`} className="block">
                <img
                  src={business.profile?.[0] || "/placeholder.jpg"}
                  alt={business.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5 space-y-1">
                  <h2 className="text-xl font-semibold truncate">
                    {business.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {business.location.city}, {business.location.address}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {business.category?.name || "Uncategorized"}
                  </Badge>
                </div>
              </Link>

              {/* Like Button */}
              <Button
                onClick={() => handleLike(business._id)}
                variant="ghost"
                className="absolute top-4 right-4 text-xl text-red-500 z-10 bg-black/40 rounded-full p-2 shadow-md hover:cursor-pointer"
                disabled={liking === business._id}
              >
                {business.isLiked ? <FaHeart /> : <FaRegHeart />}
                <span className="ml-1 text-sm text-foreground">
                  {business.likes?.length || 0}
                </span>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
