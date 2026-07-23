import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateService } from "./service.interface";
import httpStatus from "http-status";

const createService = async (payload: ICreateService) => {
  const { technicianId, categoryId } = payload;
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  if (!isCategoryExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Category not found"
    )
  }
  const isTechnicianExist = await prisma.technicianProfile.findUnique({
    where: {
      id: technicianId
    }
  });
  if (!isTechnicianExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician not found");
  }
  const result = await prisma.service.create({
    data:payload
  })
  return result;
}

const getAllServices = async () => {
  const result = await prisma.service.findMany();
  return result;
}

export const serviceServices = {
  createService,
  getAllServices,
}