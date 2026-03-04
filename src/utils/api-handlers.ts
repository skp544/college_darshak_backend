import { Response } from "express";
import { STATUS_CODES } from "../constants/status-codes";

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
  return res.status(statusCode).json({
    message,
    error,
    data: {},
    success: false,
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
