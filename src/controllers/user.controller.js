import { generateOtpService, verifyOtpService } from "../services/user.service";
import { errorHandler, successHandler } from "../utils/api-handlers";

export const generateOtpController = async (req, res) => {
  try {
    const { identifier, identifierType } = req.body;

    const result = await generateOtpService({
      identifier,
      identifierType,
    });

    return successHandler({
      res,
      message: result.message,
      statusCode: 200,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
};

export const verifyOtpController = async (req, res) => {
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
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
};
