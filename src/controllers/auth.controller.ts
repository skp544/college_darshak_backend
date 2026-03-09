import { RequestHandler } from "express";
import {
  generateOtpService,
  loginWithPasswordService,
  signUpWithPasswordService,
  verifyOtpService,
} from "../services/auth.service";
import { successHandler, errorHandler } from "../utils/api-handlers";
import { STATUS_CODES } from "../constants/status-codes";

export const generateOtpController: RequestHandler = async (req, res) => {
  try {
    const { identifier, identifierType } = req.body;

    const result = await generateOtpService({
      identifier,
      identifierType,
    });

    return successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const verifyOtpController: RequestHandler = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const result = await verifyOtpService({
      identifier,
      otp,
    });

    successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const signUpWithPassword: RequestHandler = async (req, res) => {
  try {
    const { identifier, identifierType, password } = req.body;

    const result = await signUpWithPasswordService({
      identifier,
      identifierType,
      password,
    });

    successHandler({
      statusCode: STATUS_CODES.CREATED,
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

export const signInWithPassword: RequestHandler = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const result = await loginWithPasswordService({
      identifier,
      password,
    });

    successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};
