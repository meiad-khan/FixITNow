import { BookingStatus } from "../../../prisma/generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IReviewPayload } from "./review.interface";
import httpStatus from "http-status";

const createReview = async (userId: string, payload: IReviewPayload) => {
  const { bookingId, reviewText } = payload;
  const rating = Number(payload.rating);
  if (rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5.",
    );
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Review already exists for this booking.",
    );
  }
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId
    }
  });
  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found"
    )
  }
  if (booking.status !== BookingStatus.COMPLETED) {
     throw new AppError(
       httpStatus.BAD_REQUEST,
       "You can review only completed bookings.",
     );
  }
  const result = await prisma.review.create({
    data: {
      bookingId: bookingId,
      rating: rating,
      reviewText: reviewText,
    },
  });
  return result;
}


export const reviewServices = {
  createReview,
}