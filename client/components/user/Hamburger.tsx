"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { LogOut } from "lucide-react";

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, status } = useAppSelector((state: RootState) => state.user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {" "}
      <button
        onClick={toggleMenu}
        className="relative z-50 p-2 focus:outline-none"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <Image
          alt={"Hamburger menu icon"}
          height={32}
          width={34}
          src={"/images/hamburger-menu.svg"}
          className={`transition-transform duration-300 ${isOpen && "hidden"}`}
        />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 dark:bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        ></div>
      )}
      {/* Menu Panel - slides in from the right */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 w-64 bg-black/80 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 flex flex-col h-screen bg-background/90 backdrop-blur">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-6 text-foreground">Menu</h2>
            <Image
              onClick={closeMenu}
              alt={"close icon"}
              height={10}
              width={34}
              src={"/images/close-icon.svg"}
              className={`dark:bg-primary hover:cursor-pointer rounded-md transition-transform mb-6 duration-300 ${
                !isOpen && "hidden"
              }`}
            />
          </div>
          <nav className="flex-grow">
            <ul className="flex flex-col gap-4">
              <li>
                {/* Use Link component for client-side navigation */}
                <Link
                  href="/home"
                  className="block hover:text-primary transition-colors"
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="block hover:text-primary transition-colors"
                  onClick={closeMenu}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/businesses"
                  className="block hover:text-primary transition-colors"
                  onClick={closeMenu}
                >
                  Businesses
                </Link>
              </li>
              {!user && (
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link
                      href={"/auth/login"}
                      className="block hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/signup"}
                      className="block hover:text-primary transition-colors"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              )}
            </ul>
          </nav>
          <div className="mt-auto pt-4 border-t border-border flex justify-between">
            <ThemeSwitcher />
            {user && (
              <button>
                <LogOut className="text-red-500" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
