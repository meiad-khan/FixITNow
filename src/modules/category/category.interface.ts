import { CategoryStatus } from "../../../prisma/generated/prisma/enums";

export interface ICreateCategory{
  categoryName: string;
  description?: string;
  status?: CategoryStatus;
}