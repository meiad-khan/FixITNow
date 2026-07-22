import { Role } from "../../../prisma/generated/prisma/enums";

export interface IRegisterPayload{
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}