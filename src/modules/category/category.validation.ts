import z from "zod";
import { CategoryStatus } from "../../../prisma/generated/prisma/enums";

export const createCategorySchema = z.object({
  categoryName: z.string().trim().min(1,"Category name is required"),
  description: z.string().trim().optional(),
  status: z.enum(CategoryStatus).default(CategoryStatus.AVAILABLE),
})

export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;