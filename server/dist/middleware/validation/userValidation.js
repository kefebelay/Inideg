"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255),
        email: zod_1.z.string().email().max(255),
        password: zod_1.z
            .string()
            .min(6, "password should be more than 6 characters")
            .max(255),
        role: zod_1.z.enum(["admin", "user", "business"]).optional().default("user"),
        age: zod_1.z.coerce.number().max(120, "You are either immortal or lying 👀"),
        profile: zod_1.z.any(),
    }),
});
