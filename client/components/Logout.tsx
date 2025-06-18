import Axios from "@/lib/axios";
import { logout } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

export default function Logout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state: RootState) => state.user);
  async function Logout() {
    if (user) {
      const res = Axios.post("/auth/logout");
      toast.success("logged out successfully");
      dispatch(logout());
      router.push("/home");
      console.log(res);
      return;
    }
  }

  return (
    <button onClick={Logout} className="cursor-pointer">
      <LogOutIcon className="text-red-500 hover:text-red-700" />
    </button>
  );
}
