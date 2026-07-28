import { Prisma } from "../../../prisma/generated/prisma/client";
import {
  BookingStatus,
  UserStatus,
} from "../../../prisma/generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";
import httpStatus from "http-status";

const createBooking = async (userId: string, payload: ICreateBooking) => {
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
  const service = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
    },
  });
  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, "Service record not found");
  }
  const result = await prisma.booking.create({
    data: {
      userId,
      ...payload,
      price: service.basePrice,
    },
  });
  return result;
};

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
      userId,
    },
  });
  return result;
};

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
                  phone: true,
                },
              },
            },
          },
        },
      },
      payments: {
        select: {
          status: true,
        },
      },
      review: {
        select: {
          id: true,
          reviewText: true,
          rating: true,
        },
      },
    },
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  return booking;
};

const getTechnicianBookings = async (id: string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId: id,
    },
  });
  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }
  const result = await prisma.booking.findMany({
    where: {
      service: {
        technician: {
          userId: id,
        },
      },
    },
  });
  return result;
};

const changeBookingStatus = async (
  userId: string,
  bookingId: string,
  payload: { status: string },
) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });
  if (!technician) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }
  const { status } = payload;
  const upperStatus = status?.toUpperCase() as BookingStatus;
  if (upperStatus === booking.status) {
    throw new AppError(httpStatus.CONFLICT, "Status already updated");
  }

  const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    REQUESTED: [BookingStatus.ACCEPTED, BookingStatus.DECLINED],
    ACCEPTED: [],
    PAID: [BookingStatus.IN_PROGRESS],
    IN_PROGRESS: [BookingStatus.COMPLETED],
    COMPLETED: [],
    DECLINED: [],
    CANCELLED: [],
  };

  const allowed = allowedTransitions[booking.status];

  if (!allowed.includes(upperStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change booking status from ${booking.status} to ${upperStatus}.`,
    );
  }

  const data: Prisma.BookingUpdateInput = {
    status: upperStatus,
  };

  switch (upperStatus) {
    case BookingStatus.ACCEPTED:
      data.acceptedAt = new Date();
      break;

    case BookingStatus.COMPLETED:
      data.completedAt = new Date();
      break;
  }
  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data,
  });

  return result;
};

const cancelBooking = async (userId: string,  bookingId:string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId
    }
  });
  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found"
    )
  }
  if (
    booking.status === BookingStatus.IN_PROGRESS ||
    booking.status === BookingStatus.COMPLETED ||
    booking.status === BookingStatus.DECLINED ||
    booking.status === BookingStatus.CANCELLED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking cannot be cancelled.",
    );
  }
  const result = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status:BookingStatus.CANCELLED,
      cancelledAt:new Date(),
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
  cancelBooking,
};
