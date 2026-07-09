import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(httpStatus.NOT_FOUND).json({
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
};
