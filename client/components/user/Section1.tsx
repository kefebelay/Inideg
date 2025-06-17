import React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Section1() {
  return (
    <div className="relative bg-[url('/images/home-background-light.png')] dark:bg-[url('/images/home-background.png')] bg-cover bg-center h-screen w-full">
      <div className="absolute inset-0 dark:bg-[#0E181B]/90 " />

      <div className="relative z-10 flex items-center justify-center h-full px-4 md:px-20">
        <div className="text-center max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Showcase Your Business
            <br />
            <span className="bg-gradient-to-r from-[#3638AF] via-[#50E0FF] to-[#785476] bg-clip-text text-transparent">
              to the Right Audience
            </span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-400 px-2 md:px-16">
            Our platform helps businesses showcase their products and services,
            making it easier than ever to attract the right audience. Get
            noticed, gain customers, and grow your brand—all in one place.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className={buttonVariants({ variant: "default" })}>
              Get Started
            </Link>
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Explore Businesses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
