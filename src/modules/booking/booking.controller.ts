import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingServices } from "./booking.service";
import httpStatus from "http-status";
import { BookingStatus } from "../../../prisma/generated/prisma/enums";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await bookingServices.createBooking(
      userId as string,
      req.body,
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  },
);

const getUserBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bookingServices.getUserBooking(req.user?.id as string);
     res.status(httpStatus.OK).json({
       success: true,
       statusCode: httpStatus.OK,
       message: "User's booking retrieved successfully",
       data: result,
     });
  },
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bookingServices.getSingleBooking(req.params.bookingId as string);
     res.status(httpStatus.OK).json({
       success: true,
       statusCode: httpStatus.OK,
       message: "Booking details retrieved successfully",
       data: result,
     });
  },
);

const getTechnicianBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await bookingServices.getTechnicianBookings(
      req.user?.id as string,
    );
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician's bookings retrieved successfully",
      data: result,
    });
  },
);

const changeBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { bookingId } = req.params;
    const payload = req.body;
    const result = await bookingServices.changeBookingStatus(userId as string, bookingId as string, payload);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking's status changed successfully",
      data: result,
    });
  },
);

const handleCancelBooking=catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.bookingId;
    const result = await bookingServices.cancelBooking(userId as string, bookingId as string);
     res.status(httpStatus.OK).json({
       success: true,
       statusCode: httpStatus.OK,
       message: "Booking' cancelled successfully",
       data: result,
     });
  })

export const bookingController = {
  createBooking,
  getUserBooking,
  getSingleBooking,
  getTechnicianBookings,
  changeBookingStatus,
  handleCancelBooking,
};
