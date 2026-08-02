import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { authServices } from "./auth.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { registerSchema } from "./auth.validation";


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = registerSchema.parse(req.body);
  const result = await authServices.registerUser(payload);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registration successfull",
    data:result
  });
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

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfull",
      data:result
    });
  },
);

const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authServices.getProfile(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data:result
  });
})


const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  const {accessToken} = await authServices.refreshAccessToken(refreshToken);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Token refreshed successfully",
    data:{accessToken}
  });
})


export const authController = {
  registerUser,
  loginUser,
  refreshToken,
  getProfile,
}