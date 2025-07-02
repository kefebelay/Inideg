import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import cloudinary from "../cloudinary.config";
import streamifier from "streamifier";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password, username, age, role } = req.body;

    if (!name || !email || !password || !username || !age) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      res.status(409).json({ error: "Email or username already in use" });
      return;
    }

    let profileUrl: string | undefined;
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file!.buffer).pipe(stream);
        });

      const result: any = await streamUpload();
      profileUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      age,
      password: hashedPassword,
      username,
      role,
      profile: profileUrl,
    });

    const saved = await user.save();
    res.status(201).json({ message: "User created successfully", user: saved });
  } catch (err: any) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res
      .status(200)
      .json({ message: `user ${user?.name} deleted successfully` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
export async function getuser(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  res.status(200).json({ user: user });
}
export async function getUsers(req: Request, res: Response) {
  try {
    const users = await User.find();
    res.status(200).json({ users: users });
  } catch (err: any) {
    res.json(err);
  }
}
export async function updateUser(req: Request, res: Response) {
  try {
    let profileUrl = req.body.profile;

    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file!.buffer).pipe(stream);
        });

      const result: any = await streamUpload();
      profileUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, profile: profileUrl },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err: any) {
    console.error("User update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
}
