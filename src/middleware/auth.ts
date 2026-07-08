import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../prisma/generated/prisma/enums";
import sendResponse from "../utils/sendReponse";
import httpStatus from "http-status";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";

export const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      //* Check client sends token in header
      if (!token) {
        sendResponse(res, {
          statusCode: httpStatus.UNAUTHORIZED,
          success: false,
          message: "Unauthorized access",
          data: {},
        });
      }

      const decodedToken = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: {
          email: decodedToken.email,
        },
        omit: {
          password: true,
        },
      });

      //* Check Roles
      if (roles.length && user && !roles.includes(user.role)) {
        sendResponse(res, {
          statusCode: httpStatus.UNAUTHORIZED,
          success: false,
          message: "Access forbidden with your role.",
          data: {},
        });
      }

      //* Attach loggedIn user to req
      req.user = decodedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};
