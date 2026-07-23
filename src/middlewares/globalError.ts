import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

export const globalError = (err: any, req: Request, res: Response, next:NextFunction) => {
   let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
   let message : string = "Something went wrong";

   if (err instanceof AppError) {
     statusCode = err.statusCode;
     message = err.message;
   } else if (err instanceof Error) {
     message = err.message;
   }

   res.status(statusCode).json({
     success: false,
     statusCode,
     message,
     errorDetails: err.stack,
   });
}