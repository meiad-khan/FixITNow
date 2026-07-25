import { Prisma } from "../../../prisma/generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateTechnicianProfile, IUpdateTechnicianProfile } from "./technicianProfile.interface";
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

const getAllTechnician = async () => {
  const result = await prisma.technicianProfile.findMany();
  return result;
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