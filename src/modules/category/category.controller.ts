import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryServices } from "./category.service";
import httpStatus from "http-status";


const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await categoryServices.createCategory(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result
  })
  
})

const getAllCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await categoryServices.getAllCategory();
  res.status(httpStatus.OK).json({
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