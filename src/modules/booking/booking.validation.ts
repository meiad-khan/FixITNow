import z from "zod";
import { BookingStatus } from "../../../prisma/generated/prisma/enums";

export const createBookingSchema = z.object({
  serviceId: z.uuid("ServiceId is required"),
  scheduledAt: z.coerce.date({ message: "Schedule time is required" }),
  customerNote: z.string().trim().optional(),
});

export const singleBookingParamSchema = z.object({
  bookingId: z.uuid("BookingId is required"),
})

export const updateBookingStatusParamSchema = z.object({
  bookingId: z.uuid("BookingId is required"),
});

export const updateBookingStatusPayloadSchema = z.object({
  status: z.enum(BookingStatus),
})

export type CreateBookingPayload = z.infer<typeof createBookingSchema>;