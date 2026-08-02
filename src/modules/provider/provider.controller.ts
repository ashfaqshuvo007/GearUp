import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendReponse";
import { providerService } from "./provider.service";
import { isValidOrderStatus, isValidStatus } from "../../utils/enumUtils";
import type { OrderStatus } from "../../../prisma/generated/prisma/enums";

const addGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

const getProviderGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.data.id;
    const orders = await providerService.getProviderGears(providerId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Provider gears retrieved successfully!",
      data: orders,
    });
  },
);

const getProviderOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.data.id;
    const rawStatus = req.query.status;
    const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;

    if (status && !isValidOrderStatus(status as OrderStatus)) {
      throw new Error("Invalid Order status.");
    }

    const orders = await providerService.getProviderOrders(
      providerId,
      status as OrderStatus | undefined,
    );
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

    if (!isValidOrderStatus(status)) {
      throw new Error("Invalid Order status.");
    }

    const order = await providerService.updateOrderStatus(id as string, status);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order status updated successfully!",
      data: order,
    });
  },
);

const updateGearStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidStatus(status)) {
      throw new Error("Invalid Gear status.");
    }

    const order = await providerService.updateGearStatus(id as string, status);
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
  getProviderGears,
  updateOrderStatus,
  updateGearStatus,
};
