import { RequestHandler } from "express";
import { generateOtpService, verifyOtpService } from "../services/auth.service";
import { successHandler, errorHandler } from "../utils/api-handlers";

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

    return successHandler({
      res,
      message: result.message,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};
