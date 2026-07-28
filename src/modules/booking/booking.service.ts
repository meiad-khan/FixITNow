import { BookingStatus, UserStatus } from "../../../prisma/generated/prisma/enums";
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
  if (isUserExist.userStatus !== UserStatus.UNBAN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your user status is currently banned. Please contact with support"
    );
  }
  const service = await prisma.service.findUnique({
    where: {
      id:payload.serviceId
    }
  })
  if (!service) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Service record not found"
    )
  }
  const result = await prisma.booking.create({
    data: {
      userId,
      ...payload,
      price:service.basePrice
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
  if (isUserExist.userStatus !== UserStatus.UNBAN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your user status is currently banned. Please contact with support",
    );
  }
  const result = await prisma.booking.findMany({
    where: {
      userId
    }
  });
  return result;
}

const getSingleBooking = async (bookingId: string) => {

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,      
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

const getTechnicianBookings = async (id: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId:id
    },
  });
  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }
  const result = await prisma.booking.findMany({
    where: {
      service: {
        technician: {
         userId:id
       }
      },
    },
  });
  return result;
};

const changeBookingStatus = async (userId:string, bookingId:string, payload:{status:string}) => {
  const isTechnicianExist = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  });
  if (!isTechnicianExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Technician not found"
    )
  }
  const isBookingExist = await prisma.booking.findUnique({
    where: {
      id:bookingId
    }
  })
  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  const {status } = payload;
  const upperStatus = status?.toUpperCase() as BookingStatus;
  if (upperStatus === isBookingExist.status) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Status already updated"
    )
  }
  const result = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status:upperStatus
    }
  });
  return result;
}

export const bookingServices = {
  createBooking,
  getUserBooking,
  getSingleBooking,
  getTechnicianBookings,
  changeBookingStatus,
}