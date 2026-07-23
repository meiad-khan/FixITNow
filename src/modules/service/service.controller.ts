import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { serviceServices } from "./service.service";
import httpStatus from "http-status";


const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await serviceServices.createService(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
})

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceServices.getAllServices();
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Services retrieved successfully",
      data: result,
    });
  },
);


export const serviceController = {
  createService,
  getAllServices,
}