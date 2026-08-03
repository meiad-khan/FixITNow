import z from "zod";

export const getSingleTechnicianProfileParamschema = z.object({
  technicianId: z.uuid("Technician id is required"),
});

const dayScheduleSchema = z.array(z.string()).optional();

export const availabilitySchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

// Main schema matching ICreateTechnicianProfile
export const createTechnicianProfileSchema = z.object({
  profilePhoto: z.string().url("Profile photo must be a valid URL").optional(),
  bio: z
    .string({ message: "Bio is required" })
    .trim()
    .min(10, "Bio must be at least 10 characters long"),
  experienceYears: z
    .number({ message: "Experience years is required" })
    .nonnegative("Experience years cannot be negative"),
  location: z
    .string({ message: "Location is required" })
    .trim()
    .min(1, "Location is required"),
  availability: availabilitySchema,
});

export const updateTechnicianProfileSchema =
  createTechnicianProfileSchema.partial();