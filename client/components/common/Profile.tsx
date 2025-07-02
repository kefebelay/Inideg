"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import axios from "@/lib/axios";
import { FormInput } from "@/components/business/Form-Input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Image from "next/image";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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

      await axios.put(`/api/users/${user!._id}`, formData, {
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[--color-card] text-[--color-card-foreground] rounded-[--radius-lg] shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Profile Preview"
            width={100}
            height={100}
            className="rounded-full object-cover border border-[--color-border]"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-[--color-muted-foreground]"
        />

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
