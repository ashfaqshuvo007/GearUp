import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendReponse";
import { categoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryService.getAllCategories();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories Retrieved Successfully!",
      data: categories,
    });
  },
);

export const categoryController = {
  getAllCategories,
};
