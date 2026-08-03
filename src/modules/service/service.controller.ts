import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { serviceServices } from "./service.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { createServiceSchema } from "./service.validation";


const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = createServiceSchema.parse(req.body);
  const result = await serviceServices.createService(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
})

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceServices.getAllServices(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    data: result.data,
    meta:result.meta
  });
  },
);


export const serviceController = {
  createService,
  getAllServices,
}