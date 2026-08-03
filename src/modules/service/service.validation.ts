import z from "zod";
import { ServiceStatus } from "../../../prisma/generated/prisma/enums";

export const createServiceSchema = z.object({
  serviceName: z.string().trim().min(1, "Service name is required"),
  technicianId: z.uuid("Technician id is required"),
  categoryId: z.uuid("Category id is required"),
  description: z.string().trim().optional(),
  basePrice: z.number().positive("Base price must be greater than 0"),
  status: z.enum(ServiceStatus).default(ServiceStatus.AVAILABLE),
});

export type CreateServicePayload = z.infer<typeof createServiceSchema>;