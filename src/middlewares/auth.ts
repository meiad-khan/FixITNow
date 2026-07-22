import { NextFunction, Request, Response } from "express";
import { Role } from "../../prisma/generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";

export const auth = async (...role: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const token=
  })
}