"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
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
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

type Business = {
  _id: string;
  name: string;
  profile: string[];
  description: string;
  isLiked: boolean;
  likes: string[];
  category: { name: string };
  views: number;
  isVerified: boolean;
  location: { city: string; address: string };
};

export default function FavoritesPage() {
  const { user } = useAppSelector((state: RootState) => state.user);
  const userId = user?._id;
  const router = useRouter();

  const [favorites, setFavorites] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`/business/${userId}/liked`);
        setFavorites(res.data.businesses);
      } catch (err) {
        toast.error("Failed to load favorites");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchFavorites();
  }, [userId]);

  const handleCardClick = (id: string) => {
    router.push(`/businesses/${id}`);
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-muted-foreground text-sm">
        Loading your favorites...
      </p>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          No Favorites Yet
        </h2>
        <p className="text-muted-foreground mt-2">
          Explore businesses and tap the heart to save them here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-20">
      <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
        Your Favorites
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((business) => (
          <Card
            key={business._id}
            onClick={() => handleCardClick(business._id)}
            className="relative group overflow-hidden transition-shadow hover:shadow-xl hover:ring-1 hover:ring-primary cursor-pointer"
          >
            <Carousel className="w-full aspect-[4/3] bg-muted rounded-t-xl overflow-hidden">
              <CarouselContent>
                {business.profile.map((img, i) => (
                  <CarouselItem key={i}>
                    <img
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary">
                    {business.name}
                  </h2>
                  <Badge variant="secondary">{business.category?.name}</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {business.description}
              </p>

              <div className="text-xs text-muted-foreground mt-3 space-y-1">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {business.location.address}, {business.location.city}
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle
                    className={
                      business.isVerified ? "text-green-500" : "text-gray-400"
                    }
                  />
                  {business.isVerified ? "Verified" : "Unverified"}
                </div>
                <div className="flex items-center gap-2">
                  <FaEye className="text-yellow-500" />
                  Views: {business.views}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
