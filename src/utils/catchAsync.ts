import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // console.log("error from catchAsync ", error);
      // res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      //   success: false,
      //   successCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      //   message: error.message,
      //   errorDetails: error.stack,
      // });
      next(error);
    }
  }
}