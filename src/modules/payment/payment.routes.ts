import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/init",
  auth(Role.CUSTOMER),
  paymentController.initPayment
)

router.post(
  "/success",
  paymentController.handleSuccess
);


export const paymentRoutes = router;