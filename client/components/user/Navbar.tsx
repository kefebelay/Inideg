"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "../common/ThemeSwitcher";
import Hamburger from "@/components/user/Hamburger";
import { RootState } from "@/lib/store";
import Logout from "@/components/Logout";
import { useAppSelector } from "@/lib/hooks";
import { buttonVariants } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

export default function Navbar() {
  const { user } = useAppSelector((state: RootState) => state.user);
  console.log(user);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Categories", href: "/categories" },
    { label: "Businesses", href: "/businesses" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed top-0 w-full z-50 backdrop-blur border-b border-border bg-background/70 text-foreground transition-all duration-300">
      {/* Desktop */}
      <div className="hidden md:flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Inideg
        </Link>

        <ul className="flex items-center space-x-6 text-base font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition hover:text-primary ${
                  isActive(link.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeSwitcher />
          </li>
        </ul>

        {user ? (
          <div className="flex gap-5">
            <div className="flex-col items-center hover:cursor-pointer">
              <UserIcon className="text-primary" />
              <p className="text-primary font-extrabold">{user.username}</p>
            </div>
            <Logout />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              href="/auth/sign-up"
              className={buttonVariants({ variant: "outline" })}
            >
              Sign Up
            </Link>
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "default" })}
            >
              Login
            </Link>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden justify-between items-center px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Inideg
        </Link>
        <Hamburger />
      </div>
    </div>
  );
}
