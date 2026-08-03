import z from "zod";
import { UserStatus } from "../../../prisma/generated/prisma/enums";

export const userParamSchema = z.object({
  userId: z.uuid("User id is required"),
})

export const userStatusUpdateShcema = z.object({
  userStatus: z.enum(UserStatus).default(UserStatus.UNBAN),
})