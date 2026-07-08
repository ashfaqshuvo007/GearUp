import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendReponse";
import { categoryService } from "./category.service";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Categories Retrieved Successfully!",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  getAllCategories,
};
