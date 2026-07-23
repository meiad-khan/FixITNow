import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import { ICreateCategory } from "./category.interface"
import httpStatus from "http-status";

const createCategory = async (payload: ICreateCategory) => {
  const { categoryName, description, status } = payload;
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      categoryName
    }
  })
  if (isCategoryExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This category already exist"
    )
  }
  const category = await prisma.category.create({
    data:payload
  })
  return category;
}

const getAllCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
}

export const categoryServices = {
  createCategory,
  getAllCategory,
}