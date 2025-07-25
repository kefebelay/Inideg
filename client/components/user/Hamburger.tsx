"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { logout } from "@/lib/features/user/userSlice";
import Axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { HeartIcon, User, X, LogOutIcon } from "lucide-react";

import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { toast } from "react-toastify";

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { user } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await Axios.post("/auth/logout");
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push("/home");
      setLogoutDialogOpen(false);
      setIsOpen(false);
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Categories", href: "/categories" },
    { label: "Businesses", href: "/businesses" },
  ];

  return (
    <div className="md:hidden">
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
          className={cn(
            "transition-transform duration-300",
            isOpen && "hidden"
          )}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 dark:bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Side Menu */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 w-64 bg-black/80 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 flex flex-col h-screen bg-background/90 backdrop-blur">
          {/* Header */}
          <div className="border-b border-border pb-4 mb-4">
            <div className="flex justify-between items-center">
              {user ? (
                <Link href="/profile" className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    {user.profile ? (
                      <Image
                        src={user.profile}
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">{user.username}</span>
                </Link>
              ) : (
                <h2 className="text-xl font-bold text-foreground">Menu</h2>
              )}
              <button onClick={closeMenu} className="p-2">
                <X className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>

            <Link
              href="/favorites"
              className="flex items-center gap-2 p-3 ml-8 text-sm hover:underline"
            >
              <div className="h-5 w-px bg-muted-foreground" />
              <HeartIcon fill="red" stroke="none" width={15} height={15} />
              <span>Favorites</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-grow">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block p-3 rounded-md text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-border">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className={buttonVariants({ variant: "default", size: "lg" })}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <ThemeSwitcher />
                {/* Logout Dialog */}
                <Dialog
                  open={logoutDialogOpen}
                  onOpenChange={setLogoutDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button className="cursor-pointer">
                      <LogOutIcon className="text-red-500 hover:text-red-700" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to log out?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={handleLogout}>
                        Logout
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
