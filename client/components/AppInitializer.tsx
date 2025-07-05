"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/features/user/userSlice";

const publicRoutes = [
  /^\/$/,
  /^\/auth\/login$/,
  /^\/auth\/sign-up$/,
  /^\/home$/,
  /^\/categories(\/[^\/]+)?$/,
  /^\/category(\/[^\/]+)?$/,
  /^\/businesses(\/[^\/]+)?$/,
];

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // Always redirect "/" to "/home"
    if (pathname === "/") {
      router.replace("/home");
      return;
    }

    // Wait for auth status to resolve
    if (status === "loading") return;

    const isPublic = publicRoutes.some((route) =>
      typeof route === "string"
        ? pathname === route || pathname.startsWith(route + "/")
        : route.test(pathname)
    );

    // If not authenticated and not on a public route, redirect to /home
    if (status !== "authenticated" && !isPublic) {
      router.replace("/home");
      return;
    }

    // If authenticated, redirect to dashboard based on role if on a public route
    if (status === "authenticated" && user) {
      if (
        pathname === "/home" ||
        pathname === "/auth/login" ||
        pathname === "/auth/sign-up"
      ) {
        if (user.role === "admin") {
          router.replace("/admin");
        } else if (user.role === "business") {
          router.replace("/business");
        } // user.role === "user" stays on /home
      }
    }
  }, [status, user, pathname, router]);

  return <>{children}</>;
};

export default AppInitializer;
