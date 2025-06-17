import Footer from "@/components/user/Footer";
import Navbar from "@/components/user/Navbar";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
