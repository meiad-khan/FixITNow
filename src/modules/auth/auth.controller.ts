import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authServices } from "./auth.service";
import httpStatus from "http-status";


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const result = await authServices.registerUser(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registration successfull",
    data:result
  })
})




export const authController = {
  registerUser,
}