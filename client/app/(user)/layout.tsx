import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import React, { ReactNode } from "react";
import RouteGuard from "@/components/RouteGuard";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    </RouteGuard>
  );
}
