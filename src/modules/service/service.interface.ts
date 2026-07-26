import { ServiceStatus } from "../../../prisma/generated/prisma/enums";
import { ServiceWhereInput } from "../../../prisma/generated/prisma/models";

export interface ICreateService {
  serviceName: string;
  technicianId: string;
  categoryId: string;
  description?: string;
  basePrice: number;
  status?: ServiceStatus;
}

export interface ServiceQueryPayload {
  searchTerm?: string;
  category?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;

  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}