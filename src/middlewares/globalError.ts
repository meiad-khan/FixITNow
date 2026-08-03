import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { Prisma } from "../../prisma/generated/prisma/client";
import { ZodError } from "zod";

export const globalError:ErrorRequestHandler = (err: any, req: Request, res: Response, next:NextFunction) => {
   let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = "Something went wrong";
  let errorDetails: unknown = null;

   if (err instanceof AppError) {
     statusCode = err.statusCode;
     message = err.message;
   } else if (err instanceof ZodError) {
     statusCode = httpStatus.BAD_REQUEST,
       message = "Validation failed";
     errorDetails = err.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
   }else if (err instanceof Prisma.PrismaClientKnownRequestError) {
     switch (err.code) {
       case "P2002": 
      statusCode = httpStatus.CONFLICT;

      const target = err.meta?.target;
      let field = "Field";

      if (Array.isArray(target)) {
        field = target.join(", ");
      } else if (typeof target === "string") {
        field = target;
      }

      message = `${field} already exists`;
      break;
       case "P2003":
         statusCode = httpStatus.BAD_REQUEST;
           message = "Foreign key constraint failed";
         break;
       case "P2025":
         statusCode = httpStatus.NOT_FOUND;
           message =
             "An operation failed because it depends on one or more records that were required but not found.";
         break;
       case "P2000":
         statusCode = httpStatus.BAD_REQUEST;
           message =
             "The provided value for the column is too long for the column's type";
         break;
       case "P2001":
         statusCode = httpStatus.NOT_FOUND,
           message = "Record does not exist";
         break;
       case "P2011":
         statusCode = httpStatus.BAD_REQUEST;
           message = "Null constraint violation";
         break;
       case "P2012":
         statusCode = httpStatus.BAD_REQUEST;
           message = "Missing required value";
         break;
       case "P2021":
         statusCode = httpStatus.BAD_REQUEST;
           message = "A table does not exist";
         break;
       case "P2022":
         statusCode = httpStatus.BAD_REQUEST;
           message = "Column does not exist";
         break;
       case "P2024":
         statusCode = httpStatus.SERVICE_UNAVAILABLE;
         message = "Connection timed out";
         break;
       case "P2028":
         message = "Transaction api error";
         break;
       case "P2034":
         statusCode = httpStatus.CONFLICT;
         message = "Transaction conflict";
         break;
     }
   } else if (err instanceof Prisma.PrismaClientValidationError) {
     statusCode = httpStatus.BAD_REQUEST;
     message = "You have provided incorrect field type or missing fields";
   } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
     message = "Error occurred during query execution";
   } else if (err instanceof Prisma.PrismaClientInitializationError) {
     switch (err.errorCode) {
       case "P1000":
         statusCode = httpStatus.UNAUTHORIZED;
         message = "Authentication failed against database server";
         break;
       case "P1001":
         statusCode = httpStatus.BAD_REQUEST;
         message = "Can't reach database server.";
     }
   } else if (err instanceof Prisma.PrismaClientRustPanicError) {
     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
     message = "Database engine crashed.";
   } else if (err instanceof Error) {
     message = err.message;
   }

   res.status(statusCode).json({
     success: false,
     statusCode,
     message,
     errorDetails: errorDetails? errorDetails : err.stack,
   });
}