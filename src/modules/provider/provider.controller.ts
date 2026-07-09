import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendReponse";
import { providerService } from "./provider.service";

const addGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user?.data.id);
    const gear = await providerService.addGear(req.user?.data.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Gear added to inventory successfully!",
      data: gear,
    });
  },
);

const updateGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const gear = await providerService.updateGear(id as string, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gear updated successfully!",
      data: gear,
    });
  },
);

const deleteGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const gear = await providerService.deleteGear(id as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gear removed from inventory successfully!",
      data: [],
    });
  },
);

const getProviderOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.data.id;
    const orders = await providerService.getProviderOrders(providerId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Provider orders retrieved successfully!",
      data: orders,
    });
  },
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await providerService.updateOrderStatus(id as string, status);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order status updated successfully!",
      data: order,
    });
  },
);

export const providerController = {
  addGear,
  updateGear,
  deleteGear,
  getProviderOrders,
  updateOrderStatus,
};
