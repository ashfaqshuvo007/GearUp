import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../utils/sendReponse";
import httpStatus from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.data.id as string;
    // const session = await paymentService.createCheckoutSession(userId);

    // sendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: "Checkout completed successfully!",
    //   data: session,
    // });
  },
);

export const paymentController = {
  createCheckoutSession,
};
