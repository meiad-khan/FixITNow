import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryServices } from "./category.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { createCategorySchema } from "./category.validation";


const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = createCategorySchema.parse(req.body);
  const result = await categoryServices.createCategory(payload);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,
  });
  
})

const getAllCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await categoryServices.getAllCategory();

   sendResponse(res, {
     success: true,
     statusCode: httpStatus.OK,
     message: "Categories retrieved successfully",
     data: result,
   });
})


export const categoryController = {
  createCategory,
  getAllCategory,
}