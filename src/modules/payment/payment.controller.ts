import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../utils/sendReponse";
import httpStatus from "http-status";

const getUsersAllPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.data.id as string;
    const payments = await paymentService.getUsersAllPayments(userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payments retrieved successfully!",
      data: payments,
    });
  },
);

const getPaymentDetailsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payment = await paymentService.getPaymentDetailsById(id as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment details retrieved successfully!",
      data: payment,
    });
  },
);

export const paymentController = {
  getUsersAllPayments,
  getPaymentDetailsById,
};
