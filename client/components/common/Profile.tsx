"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "@/lib/hooks";
import axios from "@/lib/axios";
import { FormInput } from "@/components/business/Form-Input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.user);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      });
      setPreviewUrl(user.profile || "");
    }
  }, [user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profileImage) {
        formData.append("profile", profileImage);
      }

      await axios.put(`/user/${user!._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto  p-6 bg-[--color-card] text-center text-[--color-card-foreground] rounded-[--radius-lg] shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 ">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 cursor-pointer ${
            isDragActive ? "border-primary bg-primary/10" : "border-border"
          }`}
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <div className="flex flex-col items-center">
              <Image
                src={previewUrl}
                alt="Profile Preview"
                width={100}
                height={100}
                className="rounded-full object-cover border-2 border-border mb-2"
              />
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

        <FormInput
          id="name"
          label="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormInput
          id="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="mt-4">
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
