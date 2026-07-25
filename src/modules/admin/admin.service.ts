import { UserStatus } from "../../../prisma/generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import httpStatus from "http-status";

const getAllUsers=async()=>{
  const result = await prisma.user.findMany();
  return result;
}

const updateUserStatus = async (id: string, payload:{userStatus:string}) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found"
    );
  }
  const userStatus = payload.userStatus?.toUpperCase() as UserStatus;
  if (isUserExist.userStatus === userStatus) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User status already up to date"
    )
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      userStatus
    }
  });
  return result;
}

export const adminServices = {
  getAllUsers,
  updateUserStatus,
}