import { Role } from "../../../prisma/generated/prisma/enums";
import { config } from "../../config";
import { prisma } from "../../lib/prisma"
import { IRegisterPayload } from "./auth.interface"
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const registerUser = async (payload:IRegisterPayload) => {
  const { email, phone, password } = payload;
  const role = payload.role?.toUpperCase() as Role;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      phone
    }
  })
  if (isUserExist) {
    throw new Error("User with this email/phone already exist");
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
    throw new Error("Invalid credential");
  }
  if (user.userStatus === "BAN") {
    throw new Error("You are banned. Please contact with support");
  }
  const isPassMatch = await bcrypt.compare(password, user.password);
  if (!isPassMatch) {
    throw new Error("Password is invalid");
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
  
}



export const authServices = {
  registerUser,
  loginUser,
  getProfile,
}