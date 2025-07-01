"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Ubuntu } from "next/font/google";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import { cn } from "@/lib/utils";
import Logout from "../Logout";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: <Users className="w-6 h-6" />,
  },
  {
    name: "Businesses",
    href: "/admin/businesses",
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    name: "Category",
    href: "/admin/category",
    icon: <FolderKanban className="w-6 h-6" />,
  },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/auth/login");
  };

  return (
    <div
      className={cn("flex h-screen bg-muted text-foreground", ubuntu.className)}
    >
      {/* Sidebar */}
      <aside
        className={cn(
          sidebarOpen ? "w-62" : "w-16",
          "bg-card text-card-foreground transition-all duration-300 border-r border-border flex flex-col justify-between"
        )}
      >
        <div>
          {/* Top Logo & Toggle */}
          <div className="flex items-center justify-between p-4">
            <span className="text-2xl font-bold whitespace-nowrap overflow-hidden transition-all duration-300">
              {sidebarOpen ? "" : "I"}
            </span>
            {sidebarOpen && (
              <div className="flex justify-between w-full items-center">
                <p className="font-bold text-xl tracking-wide">INIDEG</p>
                <button onClick={() => setSidebarOpen(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 px-2 mt-4 md:mt-20">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-4 px-5 py-4 rounded-xl text-lg hover:bg-primary/10 transition cursor-pointer",
                      isActive &&
                        "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                    )}
                  >
                    {item.icon}
                    {sidebarOpen && <span>{item.name}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4">
          <Logout />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shadow-sm">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden md:block"
              >
                <Menu className="w-6 h-6 cursor-pointer" />
              </button>
            )}
          </div>
          <ThemeSwitcher />
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
