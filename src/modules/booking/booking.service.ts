import AppError from "../../errors/AppError"
import { prisma } from "../../lib/prisma"
import { ICreateBooking } from "./booking.interface"
import httpStatus from "http-status";


const createBooking = async (userId:string, payload:ICreateBooking) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id:userId
    }
  })
  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found"
    )
  }
  const result = await prisma.booking.create({
    data: {
      userId,
      ...payload
    }
  });
  return result;
}

const getUserBooking = async (userId: string) => {
   const isUserExist = await prisma.user.findUnique({
     where: {
       id: userId,
     },
   });
   if (!isUserExist) {
     throw new AppError(httpStatus.NOT_FOUND, "User not found");
   }
  const result = await prisma.booking.findMany({
    where: {
      userId
    }
  });
  return result;
}

export const bookingServices = {
  createBooking,
  getUserBooking,
}