"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/features/user/userSlice";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useSelector((state: RootState) => state.user);
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/home",
    pathname.startsWith("/categories"),
  ];
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (pathname === "/") {
      router.replace("/home");
    }
    if (status === "authenticated" && pathname === "/home") {
      if (!user) {
        router.replace("/home");
      } else if (user.role === "user") {
        router.replace("/home");
      } else if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "business") {
        router.replace("/business");
      }
    }
    if (status === "loading" && !publicRoutes.includes(pathname)) {
      router.replace("/home");
    }
  }, [status, user, pathname, router]);

  return <>{children}</>;
};

export default AppInitializer;
