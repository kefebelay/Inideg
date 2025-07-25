"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { toast } from "react-toastify";

type Business = {
  _id: string;
  name: string;
  profile: string[];
  description: string;
  contactEmail: string;
  phone: string;
  views: number;
  website: string;
  isVerified: boolean;
  category: { name: string };
  location: {
    address: string;
    city: string;
    coordinates: string;
  };
  isLiked: boolean;
  likes: string[];
};

export default function BusinessDetailsPage() {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;

  const [business, setBusiness] = useState<Business | null>(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(`/business/${id}/view?userId=${userId}`);
        setBusiness(res.data.business);
      } catch (err) {
        console.error("Failed to fetch business:", err);
      }
    };

    fetchBusiness();
  }, [id, userId]);

  const handleLike = async () => {
    if (!userId || !business) {
      toast.info("please login to like");
      return;
    }
    setLiking(true);

    try {
      await axios.post("/business/toggle-like", {
        businessId: business._id,
        userId,
      });

      const res = await axios.get(`/business/${id}?userId=${userId}`);
      setBusiness(res.data.business);
    } catch (err) {
      console.error("Like toggle failed", err);
    } finally {
      setLiking(false);
    }
  };

  if (!business) {
    return (
      <p className="p-6 text-muted-foreground mt-20 text-center">Loading...</p>
    );
  }

  return (
    <div className="max-w-6xl mt-20 mx-auto p-4 md:p-6 ">
      <div className="flex md:hidden items-start justify-between gap-2 flex-wrap p-3">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {business.name}
          </h1>
          <Badge variant="secondary">{business.category?.name}</Badge>
        </div>
        <Button
          onClick={handleLike}
          variant="ghost"
          className="text-red-500 text-xl hover:cursor-pointer"
          disabled={liking}
        >
          {business.isLiked ? <FaHeart /> : <FaRegHeart />}
          <span className=" text-sm text-foreground">
            {business.likes.length}
          </span>
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Carousel */}
        <div className="lg:w-1/2 w-full">
          <Carousel className="w-full rounded-xl overflow-hidden">
            <CarouselContent>
              {business.profile.map((img, index) => (
                <CarouselItem key={index} className="aspect-[4/3]">
                  <img
                    src={img}
                    alt={`Business image ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Description
            </h2>
            <p className="text-muted-foreground text-sm">
              {business.description}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="lg:w-1/2 w-full flex flex-col gap-4">
          <div className="hidden md:flex items-start justify-between gap-2 flex-wrap">
            <div className="">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                {business.name}
              </h1>
              <Badge variant="secondary">{business.category?.name}</Badge>
            </div>
            <Button
              onClick={handleLike}
              variant="ghost"
              className="text-red-500 text-xl"
              disabled={liking}
            >
              {business.isLiked ? <FaHeart /> : <FaRegHeart />}
              <span className="ml-1 text-sm text-foreground">
                {business.likes.length}
              </span>
            </Button>
          </div>

          <Card className="bg-card border border-border shadow-sm">
            <CardContent className="p-6 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <FaMapMarkerAlt />
                {business.location.address}, {business.location.city}
              </div>
              <p>
                <strong>Coordinates:</strong> {business.location.coordinates}
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope />
                {business.contactEmail || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaPhone />
                {business.phone || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaGlobe />
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {business.website || "N/A"}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <FaCheckCircle
                  className={
                    business.isVerified ? "text-green-500" : "text-gray-400"
                  }
                />
                {business.isVerified ? "Verified" : "Unverified"}
              </p>
              <p className="flex items-center gap-2">
                <FaEye className="text-yellow-500" /> Views: {business.views}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
