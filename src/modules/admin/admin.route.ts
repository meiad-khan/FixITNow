import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
  "/users",
  auth(Role.ADMIN),
  adminController.getAllUsers
);

router.patch(
  "/users/:userId",
  auth(Role.ADMIN),
  adminController.updateUserStatus
);

router.get(
  "/bookings",
  auth(Role.ADMIN),
  adminController.getAllBookings
)

export const adminRoutes = router;