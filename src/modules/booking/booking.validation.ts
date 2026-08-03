import z from "zod";

export const createBookingSchema = z.object({
  serviceId: z.uuid("ServiceId is required"),
  scheduledAt: z.coerce.date({ message: "Schedule time is required" }),
  customerNote: z.string().trim().optional(),
});

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;