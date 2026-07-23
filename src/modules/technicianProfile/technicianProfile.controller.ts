import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { technicianServices } from "./technicianProfile.service";
import httpStatus from "http-status";

const createTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianServices.createTechnicianProfile(
    req.user?.id as string,
    req.body);
  
   res.status(httpStatus.CREATED).json({
     success: true,
     statusCode: httpStatus.CREATED,
     message: "Technician Profile created successfully",
     data: result,
   });
})

const getAllTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianServices.getAllTechnician();
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "All Technician retrieved successfully",
    data: result,
  });
})


export const technicianController = {
  createTechnicianProfile,
  getAllTechnician,
}