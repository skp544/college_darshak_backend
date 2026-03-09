import mailSender from "../helpers/mail";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { STATUS_CODES } from "../constants/status-codes";
import {
  AUTH_PROVIDER,
  IDENTIFIER_TYPE,
  IdentifierType,
} from "../constants/enums";
import { jwtToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/hash-password";

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

  // Remove existing OTPs
  await prisma.otpSchema.deleteMany({
    where: { identifier },
  });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.otpSchema.create({
    data: {
      identifier,
      identifierType,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  //////////////////////////////////////////////////////
  // Send OTP
  //////////////////////////////////////////////////////

  if (identifierType === IDENTIFIER_TYPE.EMAIL) {
    await mailSender(
      identifier,
      "OTP Verification - College Decode",
      `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    );
  }

  if (identifierType === IDENTIFIER_TYPE.PHONE) {
    // integrate SMS provider here (Twilio / MSG91)
    console.log(`OTP for ${identifier}: ${otp}`);
  }

  return {
    message: "OTP sent successfully",
    data: otp,
  };
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

  //////////////////////////////////////////////////////
  // Find OTP
  //////////////////////////////////////////////////////

  const record = await prisma.otpSchema.findFirst({
    where: {
      identifier,
      otp,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new AppError("Invalid or expired OTP", STATUS_CODES.UNAUTHORIZED);
  }

  //////////////////////////////////////////////////////
  // Delete OTPs for identifier
  //////////////////////////////////////////////////////

  await prisma.otpSchema.deleteMany({
    where: { identifier },
  });

  //////////////////////////////////////////////////////
  // Find existing user
  //////////////////////////////////////////////////////

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phoneNo: identifier }],
    },
  });

  //////////////////////////////////////////////////////
  // Create user if not exists
  //////////////////////////////////////////////////////

  let finalUser = user;

  if (!finalUser) {
    const userData =
      record.identifierType === IDENTIFIER_TYPE.EMAIL
        ? { email: identifier }
        : { phoneNo: identifier };

    finalUser = await prisma.user.create({
      data: {
        ...userData,
        provider: AUTH_PROVIDER.OTP,
      },
    });
  }

  const token = jwtToken.sign({
    id: finalUser.id,
    email: finalUser.email,
    role: finalUser.role,
  });

  //////////////////////////////////////////////////////
  // Return user data
  //////////////////////////////////////////////////////

  return {
    message: "OTP verified successfully",
    data: {
      id: finalUser.id,
      email: finalUser.email,
      phoneNo: finalUser.phoneNo,
      provider: finalUser.provider,
      profileCompleted: finalUser.profileCompleted,
      token: token,
    },
  };
};

export const signUpWithPasswordService = async ({
  identifier,
  identifierType,
  password,
}: {
  identifier: string;
  identifierType: IdentifierType;
  password: string;
}) => {
  if (!identifier || !identifierType || !password) {
    throw new AppError(
      "Identifier, identifier type and password are required",
      STATUS_CODES.UNPROCESSABLE_ENTITY,
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phoneNo: identifier }],
    },
  });

  if (user) {
    throw new AppError("User already exists", STATUS_CODES.CONFLICT);
  }

  const userData =
    identifierType === IDENTIFIER_TYPE.EMAIL
      ? { email: identifier }
      : { phoneNo: identifier };

  const finalUser = await prisma.user.create({
    data: {
      ...userData,
      password: await hashPassword(password),
      provider: AUTH_PROVIDER.EMAIL_PASSWORD,
    },
  });

  return {
    message: "User created successfully",
    data: finalUser,
  };
};

export const loginWithPasswordService = async ({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) => {
  if (!identifier || !password) {
    throw new AppError(
      "Identifier and password are required",
      STATUS_CODES.UNPROCESSABLE_ENTITY,
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phoneNo: identifier }],
    },
  });

  if (!user) {
    throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
  }

  if (user.provider !== AUTH_PROVIDER.EMAIL_PASSWORD) {
    throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
  }

  // const isPassword = await comparePassword(password, user.password!);

  if (!(await comparePassword(password, user.password!))) {
    throw new AppError("Invalid credentials", STATUS_CODES.UNAUTHORIZED);
  }

  const token = jwtToken.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    message: "User logged in successfully",
    data: {
      id: user.id,
      email: user.email,
      phoneNo: user.phoneNo,
      provider: user.provider,
      profileCompleted: user.profileCompleted,
      token: token,
    },
  };
};
