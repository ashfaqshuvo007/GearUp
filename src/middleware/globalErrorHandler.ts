import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendReponse";
import { Prisma } from "../../prisma/generated/prisma/client";
import httpStatus from "http-status";
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode;
  let errorMessage = err.message;
  let errorName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST; // Bad Request
    errorMessage = "Missing Field in request body or query parameters.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST; // Bad Request
    errorMessage = err.message;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR; // Internal Server Error
    errorMessage = "An unknown error occurred while processing the request.";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR; // Internal Server Error
    errorMessage = "A panic occurred in the Prisma Client.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR; // Internal Server Error
    errorMessage =
      "An error occurred during the initialization of the Prisma Client.";
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST; // Bad Request
    errorMessage = "Invalid input provided to the Prisma Client.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST; // Bad Request
    errorMessage = err.message;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR; // Internal Server Error
    errorMessage = "An unknown error occurred while processing the request.";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR; // Internal Server Error
    errorMessage = "A panic occurred in the Prisma Client.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR; // Internal Server Error
    errorMessage =
      "An error occurred during the initialization of the Prisma Client.";
  } else {
    statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = err.message || "Internal Server Error";
  }

  sendResponse(res, {
    statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    name: errorName,
    message: errorMessage,
    errors: err.stack,
  });
};

export default globalErrorHandler;
