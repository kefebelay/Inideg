"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter, notFound } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/features/user/userSlice";

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
    if (status === "loading" || status === "idle") return;

    // Always redirect "/" to "/home"
    if (pathname === "/") {
      router.replace("/home");
      return;
    }

    // If not logged in and accessing /favorites or /profile, throw 404
    if (
      !user &&
      (pathname.startsWith("/favorites") || pathname.startsWith("/profile"))
    ) {
      notFound();
      return;
    }

    // User: block /admin and /business routes
    else if (user?.role === "user") {
      if (pathname.startsWith("/admin") || pathname.startsWith("/business")) {
        notFound();
        return;
      }
    }
  }, [status, user, pathname, router]);

  return <>{children}</>;
};

export default AppInitializer;
