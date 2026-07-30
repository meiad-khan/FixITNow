import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.get("/", auth(Role.CUSTOMER), paymentController.getUsersPayment);

router.post(
  "/init",
  auth(Role.CUSTOMER),
  paymentController.initPayment
)

router.post(
  "/success",
  paymentController.handleSuccess
);

router.post(
  "/fail",
  paymentController.handleFail
);

router.post(
  "/cancel",
  paymentController.handleCancel
);

router.get(
  "/:paymentId",
  auth(Role.CUSTOMER),
  paymentController.getPaymentDetails
);

export const paymentRoutes = router;