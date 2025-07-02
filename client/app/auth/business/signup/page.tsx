"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { buttonVariants } from "@/components/ui/button";
import Axios from "@/lib/axios";
import { toast } from "react-toastify";
import { InfoIcon } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<File | null>(null);
  const [error, setError] = useState("");

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setProfile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!name || !username || !age || !email || !password) {
        setError("All fields are required.");
        return;
      }

      if (username.length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }

      const ageNumber = Number(age);
      if (isNaN(ageNumber) || ageNumber < 0) {
        setError("Please enter a valid number for service years.");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      setError("");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("age", ageNumber.toString());
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", "business");
      if (profile) {
        formData.append("profile", profile);
      }

      const res = await Axios.post("/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Account created successfully");
        router.push("/auth/login");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }

      toast.error("Signup failed. Please check your input or try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-8 p-6 sm:p-10 rounded-xl shadow-md border border-border bg-card">
        <h2 className="text-center text-2xl sm:text-3xl font-bold">
          Create an Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Business Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="age" className="block mb-1 font-medium">
              Service (in years)
            </label>
            <div className="flex text-accent gap-2">
              <InfoIcon width={17} />{" "}
              <span className="pb-1">
                How long your business/shop has been running
              </span>
            </div>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              min={0}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Business Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Profile Image</label>
            <div
              {...getRootProps()}
              className={`border border-dashed rounded-lg p-4 text-center cursor-pointer ${
                isDragActive ? "border-primary bg-primary/10" : "border-input"
              }`}
            >
              <input {...getInputProps()} />
              {profile ? (
                <div className="flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(profile)}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                  />
                  <p>{profile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to change
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Drag & drop profile image here, or click to select
                </p>
              )}
            </div>
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
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
