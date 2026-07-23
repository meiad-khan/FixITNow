import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { technicianController } from "./technicianProfile.controller";

const router = Router();

router.post(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.createTechnicianProfile
);
router.get(
  "/",
  technicianController.getAllTechnician
)

export const technicianRoutes = router;