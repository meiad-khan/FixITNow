import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  bookingController.createBooking
);

router.get(
  "/",
  auth(Role.CUSTOMER),
  bookingController.getUserBooking
);

router.get(
  "/technician",
  auth(Role.TECHNICIAN),
  bookingController.getTechnicianBookings,
);

router.get(
  "/:bookingId",
  auth(Role.CUSTOMER),
  bookingController.getSingleBooking
);

router.patch(
  "/:bookingId",
  auth(Role.TECHNICIAN),
  bookingController.changeBookingStatus
);

router.patch(
  "/:bookingId/cancel",
  auth(Role.CUSTOMER),
  bookingController.handleCancelBooking
);


export const bookingRoutes = router;