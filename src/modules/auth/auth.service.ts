import { Role } from "../../../prisma/generated/prisma/enums";
import { config } from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import { IRegisterPayload } from "./auth.interface"
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";

const registerUser = async (payload:IRegisterPayload) => {
  const { email, phone, password } = payload;
  const role = payload.role?.toUpperCase() as Role;
  if (role === Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot register as an admin.",
    );
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      phone
    }
  })
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );
  const user = await prisma.user.create({
    data: {
      ...payload,
      role,
      password:hashedPassword
    },
    omit: {
      password:true
    }
  })
  return user;
}

const loginUser = async (payload: {
  email: string;
  password: string;
  phone?:string
}) => {
  const {email, password, phone} = payload;
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.userStatus === "BAN") {
     throw new AppError(
       httpStatus.FORBIDDEN,
       "Your account has been banned. Please contact support.",
     );
  }
  const isPassMatch = await bcrypt.compare(password, user.password);
  if (!isPassMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user?.phone,
    role: user.role,
  } as JwtPayload;

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expires_in
  }as SignOptions )
  
  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
    expiresIn: config.jwt_refresh_expires_in
  } as SignOptions);
  return {
    accessToken,
    refreshToken
  }

}

const getProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      technicianProfile: true
    }
  });
  return result;
}



export const authServices = {
  registerUser,
  loginUser,
  getProfile,
}