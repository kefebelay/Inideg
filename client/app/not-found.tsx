"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegSadTear } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      setTheme(stored === "dark" ? "dark" : "light");
    }
  }, []);

  const bgStyle =
    theme === "dark"
      ? {
          background:
            "radial-gradient(ellipse at top left, #232946 60%, #121212 100%)",
        }
      : {
          background:
            "radial-gradient(ellipse at top left, #e0e7ff 60%, #f3f4f6 100%)",
        };

  return (
    <div
      className="min-h-[70vh] h-screen flex flex-col items-center justify-center text-center px-4 transition-colors duration-300"
      style={bgStyle}
    >
      <div className="flex flex-col items-center mb-6">
        <FaRegSadTear className="text-6xl text-primary mb-2 animate-bounce" />
        <h1 className="text-5xl font-extrabold text-foreground mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
          Oops! Page not found
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved. Try
          going back to the homepage or use the navigation above.
        </p>
        <Button
          asChild
          className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
