import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./review.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const userId = req.user?.id;
  const result = await reviewServices.createReview(userId as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review Created successfully.",
    data:result
  });
})


export const reviewController = {
  createReview,
}