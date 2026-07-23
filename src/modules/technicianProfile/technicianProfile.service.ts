import { Prisma } from "../../../prisma/generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateTechnicianProfile } from "./technicianProfile.interface";
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


export const technicianServices = {
  createTechnicianProfile,
  getAllTechnician,
}