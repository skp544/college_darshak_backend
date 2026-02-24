import {
  createOtp,
  deleteOtps,
  verifyOtp,
} from "../repositories/otp.repositroy.js";
import { AppError } from "../utils/AppError.js";

export const generateOtpService = async ({ identifier, identifierType }) => {
  if (!identifier || !identifierType) {
    throw new AppError("Identifier and identifier type are required", 400);
  }

  // Delete existing OTPs for that identifier
  await deleteOtps(identifier);

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await createOtp({
    identifier,
    identifierType,
    otp,
  });

  return { message: "OTP sent successfully" };
};

//////////////////////////////////////////////////////
// Verify OTP
//////////////////////////////////////////////////////

export const verifyOtpService = async ({ identifier, otp }) => {
  if (!identifier || !otp) {
    throw new AppError("Identifier and OTP are required", 400);
  }

  const record = await verifyOtp({ identifier, otp });

  if (!record) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  // Clean up after successful verification
  await deleteOtps(identifier);

  return { message: "OTP verified successfully" };
};
