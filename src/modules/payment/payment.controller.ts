import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import httpStatus from "http-status";
import { PaymentStatus } from "../../../prisma/generated/prisma/enums";

const initPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user!;
  const result = await paymentService.initiatePayment(user, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment initialized successfully. Open paymentUrl to pay.",
    data: result,
  });

});


const handleSuccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // console.log("METHOD:", req.method);
  // console.log("BODY:", req.body);
  // console.log("QUERY:", req.query);
  const { val_id, tran_id } = req.body;
  await paymentService.validatePayment(tran_id, val_id);
  res.send(`
    <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1 style="color: green;">Payment Successful!</h1>
      <p>Transaction ID: ${tran_id}</p>
    </div>
  `);
})

const handleFail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { tran_id } = req.body;
  if (tran_id) {
    await paymentService.updatePaymentStatus(tran_id as string, PaymentStatus.FAILED);
  }
  res.send(`
    <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1 style="color: #EF4444; font-size: 32px;">Payment Failed!</h1>
      <p style="font-size: 18px;">Transaction ID: <strong>${tran_id}</strong></p>
    </div>
    `);
})

const handleCancel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tran_id } = req.body;
    if (tran_id) {
      await paymentService.updatePaymentStatus(
        tran_id as string,
        PaymentStatus.FAILED,
      );
    }
    res.send(`
    <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
      <h1 style="color: #F59E0B; font-size: 32px;">Payment Cancelled!</h1>
      <p style="font-size: 18px;">Transaction ID: <strong>${tran_id}</strong></p>
    </div>
    `);
  },
);

const getUsersPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentService.getUsersPayment(req.user?.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully.",
    data: result,
  });
 })

export const paymentController = {
  initPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  getUsersPayment,
}