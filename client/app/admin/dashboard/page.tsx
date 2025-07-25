"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, businessRes] = await Promise.all([
          Axios.get("/user/all"),
          Axios.get("/business"),
        ]);
        setUsers(userRes.data.users || []);
        setBusinesses(businessRes.data.businesses || []);
      } catch (err) {
        setError("Failed to fetch admin data.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Users by role
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Businesses by verification
  const verifiedCount = businesses.filter((b) => b.isVerified).length;
  const unverifiedCount = businesses.length - verifiedCount;

  // Businesses by category
  const categoryCounts: Record<string, number> = {};
  businesses.forEach((b) => {
    const cat = b.category?.name || "Uncategorized";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Most viewed businesses
  const topViewed = [...businesses]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Most liked businesses
  const topLiked = [...businesses]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);

  // Chart data
  const userRolePie = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f472b6",
          "#f59e42",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const businessCategoryBar = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Businesses",
        data: Object.values(categoryCounts),
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
    ],
  };

  const businessVerifyPie = {
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-[--color-primary] tracking-tight text-center drop-shadow-sm">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="p-6 bg-[--color-card] rounded-2xl shadow-lg border border-[--color-border] flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
            Users by Role
          </h2>
          <div className="w-full h-64 flex items-center justify-center">
            <Pie
              data={userRolePie}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div
                key={role}
                className="px-3 py-1 rounded bg-[--color-muted] text-[--color-primary] font-semibold"
              >
                {String(role)}: {String(count)}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 bg-[--color-card] rounded-2xl shadow-lg border border-[--color-border] flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
            Businesses by Category
          </h2>
          <div className="w-full h-64">
            <Bar
              data={businessCategoryBar}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: "#e5e7eb" } },
                  y: { grid: { color: "#e5e7eb" } },
                },
              }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div
                key={cat}
                className="px-3 py-1 rounded bg-[--color-muted] text-[--color-primary] font-semibold"
              >
                {cat}: {count}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 bg-[--color-card] rounded-2xl shadow-lg border border-[--color-border] flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
            Verified vs Unverified
          </h2>
          <div className="w-full h-64 flex items-center justify-center">
            <Pie
              data={businessVerifyPie}
              options={{ plugins: { legend: { position: "bottom" } } }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <div className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold">
              Verified: {verifiedCount}
            </div>
            <div className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold">
              Unverified: {unverifiedCount}
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 bg-gradient-to-br from-[--color-card] via-[--color-background] to-[--color-primary]/10 rounded-2xl shadow-lg border border-[--color-border]">
          <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
            Top 5 Most Viewed Businesses
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[--color-muted]">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Views</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                </tr>
              </thead>
              <tbody>
                {topViewed.map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-[--color-border] hover:bg-[--color-muted]/40 transition"
                  >
                    <td className="px-4 py-2 font-semibold text-[--color-primary]">
                      {b.name}
                    </td>
                    <td className="px-4 py-2">{b.views}</td>
                    <td className="px-4 py-2">
                      {b.isVerified ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-[--color-card] via-[--color-background] to-[--color-primary]/10 rounded-2xl shadow-lg border border-[--color-border]">
          <h2 className="text-lg font-bold mb-4 text-[--color-primary]">
            Top 5 Most Liked Businesses
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[--color-muted]">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Likes</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                </tr>
              </thead>
              <tbody>
                {topLiked.map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-[--color-border] hover:bg-[--color-muted]/40 transition"
                  >
                    <td className="px-4 py-2 font-semibold text-[--color-primary]">
                      {b.name}
                    </td>
                    <td className="px-4 py-2">{b.likes?.length || 0}</td>
                    <td className="px-4 py-2">
                      {b.isVerified ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
