import axios from "axios";
import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
} from "../../../prisma/generated/prisma/enums";
import { config } from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  TInitPaymentPayload,
  TSSLCommerzInitResponse,
  TSSLCommerzValidationResponse,
} from "./payment.interface";
import httpStatus from "http-status";

const initiatePayment = async (
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  },
  payload: TInitPaymentPayload,
) => {
  const { bookingId } = payload;
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: {
        select: {
          serviceName: true,
          id: true,
          category: true,
        },
      },
      user: true,
    },
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking record not found");
  }
  if (booking.userId !== user.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Unauthorized! You can process only your booking",
    );
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only accepted bookings can be paid.",
    );
  }

  const tranId = `REF_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const amount = Number(booking.price);

  const paymentRecord = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      transactionId: tranId,
      amount,
      status: PaymentStatus.PENDING,
      provider: PaymentProvider.SSLCOMMERZ,
    },
  });

  const initData = {
    store_id: config.ssl_commerz_store_id,
    store_passwd: config.ssl_commerz_store_passwd,
    total_amount: amount,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${config.app_url}/api/payment/success`,
    fail_url: `${config.app_url}/api/payment/fail`,
    cancel_url: `${config.app_url}/api/payment/cancel`,
    ipn_url: `${config.app_url}/api/payment/ipn`,
    shipping_method: "NO",
    product_name: booking.service.serviceName || "Service Booking",
    product_category: booking.service.category.categoryName,
    product_profile: "general",
    cus_name: user.name || booking.user.name || "Customer",
    cus_email: user.email || booking.user.email || "customer@example.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.phone || booking.user.phone || "01735363958",
  };
  const response = await axios<TSSLCommerzInitResponse>({
    method: "POST",
    url: `https://sandbox.sslcommerz.com/gwprocess/v4/api.php`,
    data: new URLSearchParams(initData as any).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // console.log("response data ", response.data);

  if (response.data?.GatewayPageURL) {
    return {
      paymentUrl: response.data.GatewayPageURL,
      tranId,
      paymentRecord,
    };
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      response.data?.failedreason || "SSLCommerz payment initialization failed",
    );
  }
};


const validatePayment = async (tran_id: string, val_id:string) => {
  const validationUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${config.ssl_commerz_store_id}&store_passwd=${config.ssl_commerz_store_passwd}&format=json`;


  const {data} = await axios.get<TSSLCommerzValidationResponse>(validationUrl);
  // console.log(data);
  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId:tran_id },
  });

  if (!existingPayment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment record not found!");
  }
  if (existingPayment.status === PaymentStatus.COMPLETED) {
    return existingPayment;
  }

  const isValidStatus = data.status === "VALID" || data.status === "VALIDATED";
  const isValidAmount = Number(data.amount) === Number(existingPayment.amount);

  if (isValidStatus && isValidAmount) {
    const transactionResult = await prisma.$transaction(
      async (tx) => {
        const payment = await tx.payment.update({
          where: {
            transactionId: tran_id
          },
          data: {
            status: PaymentStatus.COMPLETED,
            paidAt: new Date(),
          }
        });
        const booking = await tx.booking.update({
          where: {
            id: existingPayment.bookingId
          },
          data: {
            status: BookingStatus.PAID
          }
        });
        return payment;
      }
    )
    console.log("transaction ",transactionResult);
    return transactionResult
  } else {
    await prisma.payment.update({
      where: { transactionId:tran_id },
      data: { status: PaymentStatus.FAILED },
    });
    throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed!");
  }
}

export const paymentService = {
  initiatePayment,
  validatePayment,
};
