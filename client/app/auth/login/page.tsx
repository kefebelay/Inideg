"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "react-toastify";
import Axios from "@/lib/axios";
import { useAppDispatch } from "@/lib/hooks";
import { fetchCurrentUser } from "@/lib/features/user/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setError("Email and password are required.");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      setError("");

      const res = await Axios.post("/auth/login", { email, password });

      if (res.status === 200) {
        const resultAction = await dispatch(fetchCurrentUser());
        if (fetchCurrentUser.fulfilled.match(resultAction)) {
          const user = resultAction.payload;

          if (user.role === "admin") {
            router.push("/admin/dashboard");
          } else if (user.role === "user") {
            router.push("/home");
          } else {
            router.push("/other-role");
          }
        }

        toast.success("Logged in successfully!");
        router.push("/home");
      } else {
        toast.error("Login failed. Please try again.");
      }

      console.log("Login response:", res.data);
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }

      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md w-full space-y-8 p-6 rounded-xl shadow-md border border-border">
        <h2 className="text-center text-2xl font-bold">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <small className="block text-sm text-red-500 text-center">
              {error}
            </small>
          )}

          <button
            type="submit"
            className={buttonVariants({
              variant: "default",
              className: "w-full",
            })}
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
