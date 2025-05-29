import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const JWT_SECRET = process.env.JWT_SECRET || "Mikasa123";
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.json({ message: "incorrect email or password" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({ message: "incorrect email or password", isMatch: isMatch });
      return;
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    res.json({ message: "Welcome back", user: user });
  } catch (err: any) {
    res.json({ error: err });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}
export async function getLoggedinUser(req: Request, res: Response) {
  const user = await User.findById((req as any).user.id).select("-password");
  res.json(user);
}
