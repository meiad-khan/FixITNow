import { ServiceStatus } from "../../../prisma/generated/prisma/enums";

export interface ICreateService{
  serviceName: string;
  technicianId: string;
  categoryId: string;
  description?: string;
  basePrice: number;
  status?:ServiceStatus
}