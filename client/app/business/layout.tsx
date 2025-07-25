import Sidebar from "@/components/business/Sidebar";
import Footer from "@/components/user/Footer";
import React, { ReactNode } from "react";
import RouteGuard from "@/components/RouteGuard";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <div>
        <Sidebar>{children}</Sidebar>
      </div>
    </RouteGuard>
  );
}
