import { ServiceWhereInput } from "../../../prisma/generated/prisma/models";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateService, IQueryPayload } from "./service.interface";
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

const getAllServices = async (query : IQueryPayload) => {

  const limit = query.limit ? Number(query.limit) : 5;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "basePrice"
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  
  const andConditions : ServiceWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          serviceName: {
            contains: query.searchTerm.trim(),
            mode:"insensitive"
          }
        },
        {
          description: {
            contains: query.searchTerm.trim(),
            mode:"insensitive"
          }
        }
      ]
    })
  }

  if (query.category) {
    andConditions.push({
      category: {
        categoryName: query.category,
      },
    });
  }

  if (query.location) {
    andConditions.push({
      technician: {
        location: query.location,
      },
    });
  }

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      basePrice: {
        ...(query.minPrice && { gte: Number(query.minPrice) }),
        ...(query.maxPrice && { lte: Number(query.maxPrice) }),
      },
    });
  }

  const result = await prisma.service.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]:sortOrder,
    },
    include: {
      category: {
        select: {
          categoryName:true,
        }
      },
      technician: {
        select: {
          user: {
            select: {
              name:true
            }
          }
        }
      }
    }
  });
  

  const totalServiceCount = await prisma.service.count({
    where: {
      AND: andConditions
    }
  })
  return {
    data: result,
    meta: {
      page: page,
      limit: limit,
      total: totalServiceCount,
      totalPages:Math.ceil(totalServiceCount/limit)
    }
  }
}

export const serviceServices = {
  createService,
  getAllServices,
}