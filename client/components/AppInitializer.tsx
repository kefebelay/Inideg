"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/lib/store"; // Adjust import paths as needed
import { fetchCurrentUser } from "@/lib/features/user/userSlice";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // if (!user || user.role === "user") {
    //   router.push("/home");
    // }
  }, [status, user, router]);

  return <>{children}</>;
};

export default AppInitializer;
