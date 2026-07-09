import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  message?: string;
  success: boolean;
  data?: T | undefined;
  errors?: any;
  errorCode?: string | null;
  name?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    errors: data.errors,
    errorCode: data.errorCode,
    name: data.name,
  });
};

export default sendResponse;
