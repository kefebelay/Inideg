import { z } from "zod"

export const createUserSchema = z.object({
    body: z.object({
        name:z.string().min(1).max(255),
        email:z.string().email().max(255),
        password:z.string()
        .min(6, "password should be more than 6 characters")
        .max(255),
        role: z.enum(["admin", "user", "business"]).optional().default("user"),
        age:z.number().max(120,"You are either immortal or lying 👀" )
    })
})