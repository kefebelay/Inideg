import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password, username, age, role, extraData } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      age,
      password: hashed,
      username,
      role,
    });
    if (role === "business") user.business = extraData;
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "profile updated successfully", user: user });
  } catch (err: any) {
    res.status(500).json(err);
  }
}
