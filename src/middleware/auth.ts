import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../prisma/generated/prisma/enums";
import sendResponse from "../utils/sendReponse";
import httpStatus from "http-status";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/encrypt";

export const authAsync = (...roles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    //* Check token exists
    if (!token) {
      throw new Error(
        "Unauthorized access! Please log in to access this resource",
      );
    }

    const verifiedToken = await verifyToken(
      token as string,
      config.jwt_secret as string,
    );

    if (!verifiedToken.success && !verifiedToken.data) {
      throw new Error(verifiedToken.error);
    }

    const { id, name, email, role } = verifiedToken.data as JwtPayload;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      omit: {
        password: true,
      },
    });

    //* Check user has an active account
    if (user?.status === "SUSPENDED") {
      sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Access forbidden as your account has been suspended",
        data: {},
      });
    }

    //* Check user has required Roles
    if (roles.length && user && !roles.includes(user.role)) {
      sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Access forbidden with your role.",
        data: {},
      });
    }

    //* Attach loggedIn user to req
    req.user = verifiedToken;

    next();
  });
};
