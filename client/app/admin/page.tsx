"use client";

import React from "react";
import { LayoutDashboard, Users, Briefcase, FolderKanban } from "lucide-react";

const adminFeatures = [
  {
    title: "Dashboard Overview",
    description:
      "Access real-time statistics and key performance indicators in a centralized dashboard.",
    icon: <LayoutDashboard className="h-6 w-6 text-[--color-primary]" />,
  },
  {
    title: "User Management",
    description:
      "View, edit, and manage all registered users with full access controls.",
    icon: <Users className="h-6 w-6 text-[--color-primary]" />,
  },
  {
    title: "Business Management",
    description:
      "Oversee registered businesses, verify information, and ensure quality standards.",
    icon: <Briefcase className="h-6 w-6 text-[--color-primary]" />,
  },
  {
    title: "Category Management",
    description:
      "Create, update, and organize product or service categories for better structure.",
    icon: <FolderKanban className="h-6 w-6 text-[--color-primary]" />,
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen px-6 py-10 bg-[--color-background] text-[--color-foreground]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome, Admin 👋</h1>
        <p className="text-muted-foreground mb-8">
          Here’s a quick overview of what you can manage in the system.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adminFeatures.map((feature, index) => (
            <div
              key={index}
              className="rounded-[--radius-lg] border border-[--color-border] bg-[--color-card] text-[--color-card-foreground] shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-[--color-muted] text-[--color-primary]">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-[--color-muted-foreground] mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
