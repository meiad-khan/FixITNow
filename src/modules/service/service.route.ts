import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { serviceController } from "./service.controller";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  serviceController.createService
);

router.get(
  "/",
  serviceController.getAllServices
);

export const serviceRoutes = router;
