import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearService } from "./gear.service";
import sendResponse from "../../utils/sendReponse";
import httpStatus from "http-status";

const getAllGears = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gears = await gearService.getAllGears(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gears Retrieved Successfully!",
      data: gears,
    });
  },
);

const getSingleGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const gearItem = await gearService.getGearItem(id as string);
    if (!gearItem) {
      throw new Error("Gear not found!");
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gear Retrieved Successfully!",
      data: gearItem,
    });
  },
);

const addReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gearId, rating, content } = req.body;
    const userId = req.user?.data.id as string;

    const review = await gearService.addReview(gearId, userId, rating, content);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Review added successfully!",
      data: review,
    });
  },
);

export const gearController = {
  getAllGears,
  getSingleGearItem,
  addReview,
};
