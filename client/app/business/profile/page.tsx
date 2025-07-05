import React from "react";
import ProfilePage from "@/components/common/Profile";

export default function BusinessProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-background]  px-4">
      <div className="w-full max-w-2xl">
        <ProfilePage />
      </div>
    </div>
  );
}
