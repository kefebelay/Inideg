"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import Axios from "@/lib/axios";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});

interface Business {
  _id: string;
  name: string;
  views: number;
  likes: string[];
  isVerified: boolean;
  createdAt: string;
}

export default function BusinessDashboardPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBusinesses = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await Axios.get(`/business/owner/${user._id}`);
        setBusinesses(res.data.businesses || []);
      } catch (err) {
        setError("Failed to fetch your businesses.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBusinesses();
  }, [user?._id]);

  // Prepare data for charts
  const businessNames = businesses.map((b) => b.name);
  const viewsData = businesses.map((b) => b.views);
  const likesData = businesses.map((b) => b.likes?.length || 0);
  const verifiedCount = businesses.filter((b) => b.isVerified).length;
  const unverifiedCount = businesses.length - verifiedCount;

  const barData = {
    labels: businessNames,
    datasets: [
      {
        label: "Views",
        data: viewsData,
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
      {
        label: "Likes",
        data: likesData,
        backgroundColor: "#f472b6",
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ["Verified", "Unverified"],
    datasets: [
      {
        data: [verifiedCount, unverifiedCount],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error)
    return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-[--color-primary] tracking-tight text-center drop-shadow-sm">
        Business Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 bg-[--color-card] rounded-2xl shadow-lg border border-[--color-border] flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
            Views & Likes per Business
          </h2>
          <div className="w-full h-72">
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                scales: {
                  x: { grid: { color: "#e5e7eb" } },
                  y: { grid: { color: "#e5e7eb" } },
                },
              }}
            />
          </div>
        </Card>
        <Card className="p-6 bg-[--color-card] rounded-2xl shadow-lg border border-[--color-border] flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
            Verified vs Unverified
          </h2>
          <div className="w-full h-72 flex items-center justify-center">
            <Pie
              data={pieData}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          </div>
        </Card>
      </div>
      <Card className="p-6 bg-gradient-to-br from-[--color-card] via-[--color-background] to-[--color-primary]/10 rounded-2xl shadow-lg border border-[--color-border]">
        <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
          Recent Businesses
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[--color-muted]">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Views</th>
                <th className="px-4 py-2 text-left">Likes</th>
                <th className="px-4 py-2 text-left">Verified</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {businesses.slice(0, 5).map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-[--color-border] hover:bg-[--color-muted]/40 transition"
                >
                  <td className="px-4 py-2 font-semibold text-[--color-primary]">
                    {b.name}
                  </td>
                  <td className="px-4 py-2">{b.views}</td>
                  <td className="px-4 py-2">{b.likes?.length || 0}</td>
                  <td className="px-4 py-2">
                    {b.isVerified ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
