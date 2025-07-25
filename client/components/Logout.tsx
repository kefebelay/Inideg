"use client";

import Axios from "@/lib/axios";
import { logout } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await Axios.post("/auth/logout");
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push("/home");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  return handleLogout;
};
