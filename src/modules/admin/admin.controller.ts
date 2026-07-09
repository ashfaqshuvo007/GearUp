import sendResponse from "../../utils/sendReponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import type { NextFunction, Request, Response } from "express";
import { ActiveStatus } from "../../../prisma/generated/prisma/client";
import { isValidStatus } from "../../utils/enumUtils";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await adminService.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully!",
      data: users,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidStatus(status)) {
      throw new Error("Invalid user status.");
    }

    const updatedUser = await adminService.updateUserStatus(
      id as string,
      status,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User status updated successfully!",
      data: updatedUser,
    });
  },
);

const getAllGearListings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearListings = await adminService.getAllGearListings();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gear listings retrieved successfully!",
      data: gearListings,
    });
  },
);

const getAllRentalOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalOrders = await adminService.getAllRentalOrders();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rental orders retrieved successfully!",
      data: rentalOrders,
    });
  },
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGearListings,
  getAllRentalOrders,
};
