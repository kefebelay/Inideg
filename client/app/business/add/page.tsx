"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "@/lib/axios";
import { FormInput } from "@/components/business/Form-Input";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

const CreateBusinessPage = () => {
  const { user } = useAppSelector((state: RootState) => state.user);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    coordinates: "",
    website: "",
    contactEmail: "",
    phone: "",
    description: "",
    isVerified: false,
    category: "",
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/category");
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + images.length > 5) {
        toast.warning("You can only upload up to 5 images.");
        return;
      }

      setImages((prev) => [
        ...prev,
        ...acceptedFiles.slice(0, 5 - images.length),
      ]);
    },
    [images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 5,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("website", form.website);
      formData.append("contactEmail", form.contactEmail);
      formData.append("phone", form.phone);
      formData.append("description", form.description);
      formData.append("isVerified", String(form.isVerified));
      formData.append("category", form.category);
      formData.append("owner", `${user?._id}`);

      // Nest location fields properly
      formData.append("location[address]", form.address);
      formData.append("location[city]", form.city);
      formData.append("location[coordinates]", form.coordinates);

      // Append images
      images.forEach((image) => {
        formData.append("profile", image);
      });

      await axios.post("/business", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Business created successfully!");
      setForm({
        name: "",
        address: "",
        city: "",
        coordinates: "",
        website: "",
        contactEmail: "",
        phone: "",
        description: "",
        isVerified: false,
        category: "",
      });

      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create business.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[--color-card] text-[--color-card-foreground] rounded-[--radius-lg] shadow-md mt-10">
      <h1 className="text-2xl font-semibold mb-6">
        Create a New Business Profile
      </h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormInput
          id="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormInput
          id="address"
          label="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <FormInput
          id="city"
          label="City"
          value={form.city}
          onChange={handleChange}
          required
        />
        <FormInput
          id="coordinates"
          label="Coordinates"
          value={form.coordinates}
          onChange={handleChange}
          required
        />
        <FormInput
          id="website"
          label="Website"
          value={form.website}
          onChange={handleChange}
        />
        <FormInput
          id="contactEmail"
          label="Contact Email"
          type="email"
          value={form.contactEmail}
          onChange={handleChange}
        />
        <FormInput
          id="phone"
          label="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        {/* Category Dropdown */}
        <div className="grid gap-1.5">
          <label htmlFor="category" className="text-[--color-foreground]">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="bg-secondary text-foreground border border-border focus:ring-ring rounded-md p-2"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <textarea
          id="description"
          placeholder="Business description..."
          value={form.description}
          onChange={handleChange}
          required
          className="bg-[--color-input] text-[--color-foreground] border-2 border-[--color-border] focus:ring-[--color-ring] rounded-[--radius-md] w-full min-h-[100px] p-3"
        />

        {/* Drag and Drop Image Upload */}
        <div
          {...getRootProps()}
          className="border-2 h-20 border-dashed border-[--color-border] rounded-[--radius-md] p-4 text-center cursor-pointer bg-[--color-muted]/30 hover:bg-[--color-muted]/50 transition"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-[--color-foreground]">Drop the images here...</p>
          ) : (
            <p className="text-[--color-muted-foreground]">
              Drag & drop up to 5 images here, or click to select
            </p>
          )}
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {images.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="h-24 w-24 object-cover rounded-[--radius-sm] border border-[--color-border]"
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary p-3 rounded-md hover:bg-secondary hover:cursor-pointer"
        >
          Create Business
        </button>
      </form>
    </div>
  );
};

export default CreateBusinessPage;
