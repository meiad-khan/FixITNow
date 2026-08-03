import z from "zod";

export const createReviewSchema = z.object({
   bookingId: z.uuid("Booking id is required"),
  rating: z.number().positive("Rating is required"),
  reviewText: z.string().trim().min(1,"Review text is required"),
})

export type CreateReviewPayload=z.infer<typeof createReviewSchema>