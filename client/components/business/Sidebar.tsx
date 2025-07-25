"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Ubuntu } from "next/font/google";
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  PlusCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { useLogout } from "@/components/Logout";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/business/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "My Business",
    href: "/business/my-business",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    name: "Add Business",
    href: "/business/add",
    icon: <PlusCircle className="w-5 h-5" />,
  },
  {
    name: "Profile",
    href: "/business/profile",
    icon: <User className="w-5 h-5" />,
  },
];

export default function BusinessSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = useLogout();

  return (
    <div
      className={cn(
        "flex h-screen bg-gradient-to-tr from-muted via-background to-muted",
        ubuntu.className
      )}
    >
      {/* Sidebar */}
      <aside
        className={cn(
          sidebarOpen ? "w-64" : "w-16",
          "backdrop-blur-lg bg-white/70 dark:bg-black/30 shadow-xl border-r border-border transition-all duration-300 flex flex-col justify-between "
        )}
      >
        {/* Top */}
        <div>
          <div className="flex items-center justify-between p-4">
            <span className="text-2xl font-extrabold tracking-tight text-primary overflow-hidden whitespace-nowrap">
              {sidebarOpen ? "INIDEG" : "I"}
            </span>
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <nav className="mt-8 space-y-1 px-3">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm cursor-pointer transition-colors",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive &&
                        "bg-primary/10 text-primary font-semibold border-l-4 border-primary pl-3"
                    )}
                  >
                    {item.icon}
                    {sidebarOpen && <span>{item.name}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout with Confirmation */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 px-5 py-4 rounded-xl text-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
            onClick={() => setShowLogout(true)}
          >
            <LogOut className="w-6 h-6" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/60 backdrop-blur">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          )}
          <ThemeSwitcher />
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Global Logout Dialog */}
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
    </div>
  );
}
