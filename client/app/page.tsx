"use client";
import { fetchCurrentUser } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bounce, ToastContainer } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser());
    router.push("/home");
  }, [dispatch]);

  return null;
}
