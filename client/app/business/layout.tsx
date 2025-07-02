import Sidebar from "@/components/business/Sidebar";
import Footer from "@/components/user/Footer";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
