import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingServices } from "./booking.service";
import httpStatus from "http-status";

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

export const bookingController = {
  createBooking,
  getUserBooking,
  getSingleBooking,
};
