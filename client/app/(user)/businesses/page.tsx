"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import Axios from "@/lib/axios";

type Business = {
  _id: string;
  name: string;
  profile: string[];
  category: { name: string };
  location: { city: string };
};

export default function BusinessListPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await Axios.get("/business");
        setBusinesses(res.data.businesses || []);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[--color-foreground]">
        All Businesses
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Link
            key={business._id}
            href={`/businesses/${business._id}`}
            className="bg-[--color-card] text-[--color-card-foreground] rounded-[--radius-md] shadow hover:shadow-lg transition p-4"
          >
            <img
              src={business.profile?.[0] || "/placeholder.jpg"}
              alt={business.name}
              className="w-full h-40 object-cover rounded-[--radius-sm] mb-2"
            />
            <h2 className="text-lg font-semibold">{business.name}</h2>
            <p className="text-sm text-[--color-muted-foreground]">
              {business.location.city}
            </p>
            <p className="text-sm text-[--color-accent-foreground] mt-1">
              {business.category?.name || "Uncategorized"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
