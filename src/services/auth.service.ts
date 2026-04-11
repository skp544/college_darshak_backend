import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { STATUS_CODES } from "../constants/status-codes";
import { jwtToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/hash-password";
import { ROLES } from "../constants/enums";

export const signUpStudentService = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    if (!email || !password || !name) {
      throw new AppError(
        "Email, password and name are required",
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing)
      throw new AppError("User already exists!", STATUS_CODES.BAD_REQUEST);

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: ROLES.STUDENT,
        studentProfile: {
          create: { name },
        },
      },
    });

    return {
      message: "Student created successfully",
      data: { userId: user.id },
    };
  } catch (error) {
    throw error;
  }
};

export const signUpMentorService = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    if (!email || !password || !name) {
      throw new AppError(
        "Email, password and name are required",
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing)
      throw new AppError("User already exists!", STATUS_CODES.BAD_REQUEST);

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: ROLES.MENTOR,
        mentorProfile: {
          create: { name },
        },
      },
    });

    return {
      message: "Mentor created successfully",
      data: { userId: user.id },
    };
  } catch (error) {
    throw error;
  }
};

export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student_profile: true,
        mentor_profile: true,
      },
    });

    if (!user) throw new AppError("User not found!", STATUS_CODES.BAD_REQUEST);

    if (!user.password)
      throw new AppError(
        "Invalid credentials",
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      throw new AppError("Invalid credentials", STATUS_CODES.BAD_REQUEST);

    const token = jwtToken.sign(user);

    return {
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile:
            user.role === ROLES.STUDENT
              ? user.student_profile
              : user.mentor_profile,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

export const sendOtpService = async ({ email }: { email: string }) => {
  try {
    if (!email) {
      throw new AppError(
        "Email is required",
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", STATUS_CODES.NOT_FOUND);

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await prisma.otp.upsert({
      where: { userId: user.id },
      update: {
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      create: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return {
      message: "OTP sent",
      data: { otp: code },
    };
  } catch (error) {
    throw error;
  }
};

export const verifyOtpService = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  try {
    if (!email || !code) {
      throw new AppError(
        "Email and OTP are required",
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new AppError("User not found", STATUS_CODES.NOT_FOUND);

    const otp = await prisma.otp.findUnique({ where: { userId: user.id } });

    if (!otp || otp.code !== code || otp.expiresAt < new Date()) {
      throw new AppError("Invalid OTP", STATUS_CODES.BAD_REQUEST);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await prisma.otp.delete({ where: { userId: user.id } });

    return {
      message: "Verified successfully",
    };
  } catch (error) {
    throw error;
  }
};

/*
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
*/
