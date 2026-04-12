import { Response } from "express";
import { STATUS_CODES } from "../constants/status-codes";
import { AppError } from "./AppError";
import { Prisma } from "../../generated/prisma/client";

interface ErrorHandlerParams {
  res: Response;
  error?: unknown;
  message?: string;
  statusCode?: number;
}

interface SuccessHandlerParams<T = unknown> {
  res: Response;
  message?: string;
  data?: T;
  statusCode?: number;
}

export const errorHandler = ({
  res,
  error,
  message = "Something went wrong",
  statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
}: ErrorHandlerParams): Response => {
  console.error(error, "error"); // 🔥 logging

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let message = "Database error";

    if (error.code === "P2002") {
      message = "Duplicate field value";
    }

    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message,
      code: error.code,
    });
  }

  if (error instanceof Error) {
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const successHandler = <T>({
  res,
  message = "Request completed successfully!",
  data,
  statusCode = STATUS_CODES.SUCCESS,
}: SuccessHandlerParams<T>): Response => {
  return res.status(statusCode).json({
    message,
    data,
    success: true,
  });
};
