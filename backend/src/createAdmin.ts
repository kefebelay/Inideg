import User from "./models/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

export async function createDefaultAdmin() {
  const existingAdmin = await User.findOne({ role: "admin" });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS!, 10);

    const adminUser = new User({
      name: "Admin",
      username: "admin",
      email: "admin@admin.com",
      password: hashedPassword,
      role: "admin",
      age: 30,
    });

    await adminUser.save();
    console.log("✅ Default admin created");
  } else {
    console.log("ℹ️ Admin already exists");
  }
}
