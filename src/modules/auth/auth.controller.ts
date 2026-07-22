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
    data: result
  })
});

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authServices.loginUser(req.body);
    const { accessToken, refreshToken } = result;
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge:7*24*60*60*1000
    })

    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfull",
      data: result
    })
  },
);

const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // const result = await authServices.getProfile(req.user?.id as string);

})



export const authController = {
  registerUser,
  loginUser,
  getProfile,
}