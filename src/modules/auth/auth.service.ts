import { Role } from "../../../prisma/generated/prisma/enums";
import { config } from "../../config";
import { prisma } from "../../lib/prisma"
import { IRegisterPayload } from "./auth.interface"
import bcrypt from "bcryptjs";

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



export const authServices = {
  registerUser,
}