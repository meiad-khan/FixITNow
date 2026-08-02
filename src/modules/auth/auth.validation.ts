import z from "zod";
import { Role } from "../../../prisma/generated/prisma/enums";

export const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().optional(),
  role: z.enum(Role).default(Role.CUSTOMER),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;