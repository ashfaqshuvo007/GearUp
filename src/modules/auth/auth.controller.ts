import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendReponse";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req.body);
    console.log(result);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const loggedInUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "User LoggedIn is : Ashfaq" });
  } catch (error) {
    console.error("Invalid Credentials", error);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};

export const authController = {
  login,
  register,
  loggedInUser,
};
