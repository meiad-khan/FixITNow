import { NextFunction, Request, Response } from "express";
import { Role } from "../../prisma/generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

declare global{
  namespace Express{
    interface Request{
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        phone?: string;
      }
    }
  }
}

export const auth =(...roles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken ?
      req.cookies.accessToken
      :
      req.headers.authorization?.startsWith("Bearer ") ?
        req.headers.authorization?.split(" ")[1] :
        req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource.",
      );
    }
    const verifyToken = jwt.verify(token, config.jwt_access_secret) as JwtPayload;
    if (!verifyToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token.");
    }
    const { name, email, role, id, phone } = verifyToken;
    if (roles.length && !roles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource.",
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role
      }
    });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    if (user.userStatus === "BAN") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account has been banned. Please contact support.",
      );
    }
    req.user = {
      id,
      name,
      email,
      role,
      phone
    }
    next();
  })
}