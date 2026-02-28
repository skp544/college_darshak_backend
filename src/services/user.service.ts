import { prisma } from "../lib/prisma";
import { IdentifierType } from "../types";
import { AppError } from "../utils/AppError";
import { STATUS_CODES } from "../utils/status-codes";

export const generateOtpService = async ({
  identifier,
  identifierType,
}: {
  identifier: string;
  identifierType: IdentifierType;
}) => {
  if (!identifier || !identifierType) {
    throw new AppError(
      "Identifier and identifier type are required",
      STATUS_CODES.UNPROCESSABLE_ENTITY,
    );
  }

  // Delete existing OTPs for that identifier
  await prisma.otpSchema.deleteMany({
    where: { identifier },
  });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.otpSchema.create({
    data: {
      identifier,
      identifierType,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  return { message: "OTP sent successfully" };
};

//////////////////////////////////////////////////////
// Verify OTP
//////////////////////////////////////////////////////

export const verifyOtpService = async ({
  identifier,
  otp,
}: {
  identifier: string;
  otp: string;
}) => {
  if (!identifier || !otp) {
    throw new AppError(
      "Identifier and OTP are required",
      STATUS_CODES.UNPROCESSABLE_ENTITY,
    );
  }

  const record = await prisma.otpSchema.findFirst({
    where: {
      identifier,
      otp,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  // Clean up after successful verification
  await prisma.otpSchema.deleteMany({
    where: { identifier },
  });

  return { message: "OTP verified successfully" };
};
