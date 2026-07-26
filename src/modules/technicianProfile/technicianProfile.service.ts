import { Prisma } from "../../../prisma/generated/prisma/client";
import { TechnicianProfileWhereInput } from "../../../prisma/generated/prisma/models";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateTechnicianProfile, IUpdateTechnicianProfile, TechnicianQueryPayload } from "./technicianProfile.interface";
import httpStatus from 'http-status';


const createTechnicianProfile = async (
  userId: string,
  payload: ICreateTechnicianProfile,
) => {
  const isProfileExist = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  });
  if (isProfileExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Technician profile already exist"
    )
  }
  const result = await prisma.technicianProfile.create({
    data: {
      userId,
      ...payload,
      availability: payload.availability as Prisma.InputJsonValue,
    },
  });
  return result
};

const getAllTechnician = async (query: TechnicianQueryPayload) => {

  const limit = query.limit ? Number(query.limit) : 5;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: TechnicianProfileWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (query.location) {
    andConditions.push({
      location: {
        equals:query.location
      }
    })
  }

  if (query.category) {
    andConditions.push({
      services: {
        some: {
          category: {
            categoryName: query.category,
          },
        },
      },
    });
  }

  if (query.serviceName) {
    andConditions.push({
      services: {
        some: {
          serviceName: query.serviceName,
        },
      },
    });
  }

  if (query.minExperience || query.maxExperience) {
    andConditions.push({
      experienceYears: {
        ...(query.minExperience && {
          gte: Number(query.minExperience),
        }),
        ...(query.maxExperience && {
          lte: Number(query.maxExperience),
        }),
      },
    });
  }
  
  const result = await prisma.technicianProfile.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]:sortOrder
    },
    include: {
      user: {
        select: {
          name:true
        }
      },
      services: {
        select: {
          serviceName: true,
          category: {
            select: {
              categoryName:true
            }
          }
        }
      }
    }
  });
  const totalTechnicianCount = await prisma.technicianProfile.count({
    where: {
      AND:andConditions
    }
  })
  return {
    data: result,
    meta: {
      page: page,
      limit: limit,
      total: totalTechnicianCount,
      totalPages:Math.ceil(totalTechnicianCount/limit)
    }
  }
}

const updateTechnicianProfile = async (id:string , payload: IUpdateTechnicianProfile) => {
  const result = await prisma.technicianProfile.update({
    where: {
      userId : id
    },
    data: {
      ...payload,
      availability: payload.availability as Prisma.InputJsonArray
    }
  })
  return result;
}

const getSingleTechnicianProfile = async (id:string) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: {
      id
    }
  });
  const reviews = await prisma.review.findMany({
    where: {
      booking: {
        service: {
          technicianId: id
        }
      }
    },
    include: {
      booking: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
            
          }
        }
      }
    }
  });
  return {
    technician,
    reviews
  }
}


export const technicianServices = {
  createTechnicianProfile,
  getAllTechnician,
  updateTechnicianProfile,
  getSingleTechnicianProfile,
}