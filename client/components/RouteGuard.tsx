"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/features/user/userSlice";

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (status === "loading" || status === "idle") return;

    // Always redirect "/" to "/home"
    if (pathname === "/") {
      router.replace("/home");
      return;
    }

    // If not logged in and accessing /favorites or /profile, redirect to not-found
    if (
      !user &&
      (pathname.startsWith("/favorites") || pathname.startsWith("/profile"))
    ) {
      router.replace("/not-found");
      return;
    }

    // Only admins can access /admin routes
    if (pathname.startsWith("/admin")) {
      if (!user || user.role !== "admin") {
        router.replace("/not-found");
        return;
      }
    }
    // Only businesses can access allowed /business routes
    else if (pathname.startsWith("/business")) {
      const allowedBusinessRoutes = [
        "/business",
        "/business/add",
        "/business/dashboard",
        "/business/my-business",
        "/business/profile",
      ];
      if (
        !user ||
        user.role !== "business" ||
        !allowedBusinessRoutes.includes(pathname)
      ) {
        router.replace("/not-found");
        return;
      }
    }
    // Users cannot access /admin or /business routes (already handled above)
  }, [status, user, pathname, router]);

  return <>{children}</>;
};

export default RouteGuard;
