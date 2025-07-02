"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";

type Business = {
  _id: string;
  name: string;
  profile: string[];
  description: string;
  contactEmail: string;
  phone: string;
  website: string;
  isVerified: boolean;
  category: { name: string };
  location: {
    address: string;
    city: string;
    coordinates: string;
  };
};

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`/business/${id}`);
        setBusiness(res.data.business);
      } catch (err) {
        console.error("Failed to fetch business:", err);
      }
    };

    fetchBusiness();
  }, [id]);

  if (!business) {
    return <p className="p-6 text-[--color-muted-foreground]">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[--color-card] text-[--color-card-foreground] rounded-[--radius-lg] shadow">
      <h1 className="text-3xl font-bold mb-4">{business.name}</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {business.profile.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Business image ${index + 1}`}
            className="w-full h-64 object-cover rounded-[--radius-md]"
          />
        ))}
      </div>

      <p className="mb-2">
        <strong>Category:</strong> {business.category?.name}
      </p>
      <p className="mb-2">
        <strong>Location:</strong> {business.location.address},{" "}
        {business.location.city}
      </p>
      <p className="mb-2">
        <strong>Coordinates:</strong> {business.location.coordinates}
      </p>
      <p className="mb-2">
        <strong>Email:</strong> {business.contactEmail}
      </p>
      <p className="mb-2">
        <strong>Phone:</strong> {business.phone}
      </p>
      <p className="mb-2">
        <strong>Website:</strong> {business.website}
      </p>
      <p className="mb-2">
        <strong>Status:</strong>{" "}
        {business.isVerified ? "Verified ✅" : "Unverified ❌"}
      </p>
      <p className="mt-4">
        <strong>Description:</strong>
      </p>
      <p className="text-[--color-muted-foreground]">{business.description}</p>
    </div>
  );
}
