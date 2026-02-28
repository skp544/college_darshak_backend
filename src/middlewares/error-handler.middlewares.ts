import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { errorHandler } from "../utils/api-handlers";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  return errorHandler({
    message: "Internal Server Error",
    res,
  });
};
