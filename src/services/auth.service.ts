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
