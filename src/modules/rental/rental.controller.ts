import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendReponse";
import { rentalService } from "./rental.service";

const createRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.data?.id as string;

    const rentalOrder = await rentalService.createRentalOrder(
      customerId,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Rental order created successfully!",
      data: rentalOrder,
    });
  },
);

const getUserRentalOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const customerId = req.user?.data?.id as string;
    const orders = await rentalService.getUserRentalOrders(customerId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rental orders retrieved successfully!",
      data: orders,
    });
  },
);

const getRentalOrderDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const order = await rentalService.getRentalOrderDetails(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rental order details retrieved successfully!",
      data: order,
    });
  },
);

export const rentalController = {
  createRentalOrder,
  getUserRentalOrders,
  getRentalOrderDetails,
};
