"use client";

import React from "react";
import { Briefcase, User, LayoutDashboard, FileText } from "lucide-react";

const businessFeatures = [
  {
    title: "Business Dashboard",
    description:
      "Monitor your business performance, track analytics, and manage your profile in one place.",
    icon: <LayoutDashboard className="h-6 w-6 text-[--color-primary]" />,
  },
  {
    title: "Profile Management",
    description:
      "Edit your business details, update your contact information, and upload a new profile image.",
    icon: <User className="h-6 w-6 text-[--color-primary]" />,
  },
  {
    title: "My Businesses",
    description:
      "View and manage all businesses you have created, including their status and statistics.",
    icon: <Briefcase className="h-6 w-6 text-[--color-primary]" />,
  },
  {
    title: "Business Documents",
    description:
      "Upload, view, and manage important business documents securely.",
    icon: <FileText className="h-6 w-6 text-[--color-primary]" />,
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen px-6 py-10 bg-[--color-background] text-[--color-foreground]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome, Business Owner 👋</h1>
        <p className="text-muted-foreground mb-8">
          Here’s a quick overview of what you can do as a business user.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {businessFeatures.map((feature, index) => (
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
