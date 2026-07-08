import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendReponse";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.registerUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  },
);

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });
    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login Successful!",
      data: result,
    });
  },
);

const loggedInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.loggedInUser(req.user?.data.id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved Successfully!",
      data: user,
    });
  },
);

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.generateRefreshToken(
    req.cookies.refreshToken,
  );

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token generated",
    data: result,
  });
});

export const authController = {
  loginUser,
  registerUser,
  loggedInUser,
  refreshToken,
};
