import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { technicianServices } from "./technicianProfile.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { createTechnicianProfileSchema, getSingleTechnicianProfileParamschema, updateTechnicianProfileSchema } from "./technicianProfile.validation";

const createTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const payload = createTechnicianProfileSchema.parse(req.body);
  const result = await technicianServices.createTechnicianProfile(
    req.user?.id as string,
    payload);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Technician Profile created successfully",
    data: result,
  });
})

const getAllTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianServices.getAllTechnician(req.query);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Technician retrieved successfully",
    data: result,
  });
})
const updateTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = updateTechnicianProfileSchema.parse(req.body);
  const result = await technicianServices.updateTechnicianProfile(req.user?.id as string, payload);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician profile updated successfully",
    data: result,
  });
})

const getSingleTechnicianProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // const { technicianId } = req.params;
  const { technicianId } = getSingleTechnicianProfileParamschema.parse(req.params);
  const result = await technicianServices.getSingleTechnicianProfile(technicianId);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician Profile with reviews retrieved successfully",
    data: result,
  });
})



export const technicianController = {
  createTechnicianProfile,
  getAllTechnician,
  updateTechnicianProfile,
  getSingleTechnicianProfile,
}