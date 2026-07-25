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

const getSingleBooking = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id,      
    },
    include: {
      service: {
        select: {
          id: true,
          serviceName: true,
          technician: {
            select: {
              id: true,
              location: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone:true,
                }
              }
            }
          }
        }
      },
      payments: {
        select: {
          status:true
        }
      },
      review: {
        select: {
          id: true,
          reviewText: true,
          rating:true
        }
      }
    }
  });
  if (!booking) {
     throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  return booking;
}

export const bookingServices = {
  createBooking,
  getUserBooking,
  getSingleBooking
}