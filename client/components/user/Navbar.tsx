"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOutIcon, User } from "lucide-react";
import ThemeSwitcher from "../common/ThemeSwitcher";
import Hamburger from "@/components/user/Hamburger";
import { useLogout } from "../Logout";

export default function Navbar() {
  const { user } = useAppSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);
  const handleLogout = useLogout();

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Categories", href: "/categories" },
    { label: "Businesses", href: "/biz" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur border-b border-border bg-background/70 text-foreground transition-all duration-300">
        {/* Desktop */}
        <div className="hidden md:flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold tracking-wide">
            Inideg
          </Link>

          <ul className="flex items-center gap-x-6 text-base font-medium">
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
          </ul>

          <div className="flex items-center gap-x-4">
            <ThemeSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-10 w-10 rounded-full"
                  >
                    {user.profile ? (
                      <Image
                        src={user.profile}
                        alt={user.username}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="hover:cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="hover:cursor-pointer">
                      Favorites
                    </Link>
                  </DropdownMenuItem>

                  {/* Open dialog on click */}
                  <DropdownMenuItem
                    onClick={() => setShowLogout(true)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        </div>

        {/* Mobile */}
        <div className="flex md:hidden justify-between items-center px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-wide">
            Inideg
          </Link>
          <Hamburger />
        </div>
      </nav>

      {/* Logout Dialog - Renders globally */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                handleLogout();
                setShowLogout(false);
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
