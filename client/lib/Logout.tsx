import Axios from "@/lib/axios";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const { user, status } = useAppSelector((state: RootState) => state.user);
  async function logout() {
    if (user) {
      const res = Axios.post("/api/logout");
      console.log(res);
    }
  }

  return (
    <button onClick={logout} className="cursor-pointer">
      <LogOutIcon className="text-red-500 hover:text-red-700" />
    </button>
  );
}
