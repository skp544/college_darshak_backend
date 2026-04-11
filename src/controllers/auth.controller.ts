// import { RequestHandler } from "express";
// import {
//   loginWithPasswordService,
//   signUpWithPasswordService,
// } from "../services/auth.service";
// import { successHandler, errorHandler } from "../utils/api-handlers";
// import { STATUS_CODES } from "../constants/status-codes";
// import { generateOtpService, verifyOtpService } from "../services/otp.service";
// import {
//   createAcademicDetailsService,
//   createPersonalDetailsService,
//   uploadDocumentsService,
// } from "../services/mentor.service";

import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../utils/hash-password";
import { errorHandler, successHandler } from "../utils/api-handlers";
import { STATUS_CODES } from "../constants/status-codes";
import { jwtToken } from "../utils/jwt";

// export const generateOtpController: RequestHandler = async (req, res) => {
//   try {
//     const { identifier, identifierType } = req.body;

//     const result = await generateOtpService({
//       identifier,
//       identifierType,
//     });

//     return successHandler({
//       res,
//       message: result.message,
//       data: result.data,
//     });
//   } catch (error) {
//     return errorHandler({
//       res,
//       error,
//     });
//   }
// };

// export const verifyOtpController: RequestHandler = async (req, res) => {
//   try {
//     const { identifier, otp } = req.body;

//     const result = await verifyOtpService({
//       identifier,
//       otp,
//     });

//     successHandler({
//       res,
//       message: result.message,
//       data: result.data,
//     });
//   } catch (error) {
//     return errorHandler({
//       res,
//       error,
//     });
//   }
// };

// export const signUpWithPassword: RequestHandler = async (req, res) => {
//   try {
//     const { identifier, identifierType, password } = req.body;

//     const result = await signUpWithPasswordService({
//       identifier,
//       identifierType,
//       password,
//     });

//     successHandler({
//       statusCode: STATUS_CODES.CREATED,
//       res,
//       message: result.message,
//       data: result.data,
//     });
//   } catch (error) {
//     errorHandler({
//       res,
//       error,
//     });
//   }
// };

// export const signInWithPassword: RequestHandler = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     const result = await loginWithPasswordService({
//       identifier,
//       password,
//     });

//     successHandler({
//       res,
//       message: result.message,
//       data: result.data,
//     });
//   } catch (error) {
//     errorHandler({
//       res,
//       error,
//     });
//   }
// };

// export const createMentorPersonalDetails: RequestHandler = async (req, res) => {
//   try {
//     const result = await createPersonalDetailsService(req.body);

//     successHandler({
//       res,
//       message: result.message,
//       data: result.data,
//     });
//   } catch (error) {
//     errorHandler({
//       res,
//       error,
//     });
//   }
// };

// export const createAcademicDetails: RequestHandler = async (req, res) => {
//   try {
//     const result = await createAcademicDetailsService(req.body);

//     successHandler({
//       res,
//       message: result.message,
//       data: result.data,
//     });
//   } catch (error) {
//     errorHandler({
//       res,
//       error,
//     });
//   }
// };

// export const uploadDocument: RequestHandler = async (req, res) => {
//   try {
//     const result = await uploadDocumentsService(req.body);

//     successHandler({
//       res,
//       message: result.message,
//     });
//   } catch (error) {
//     errorHandler({
//       res,
//       error,
//     });
//   }
// };

export const signUpStudent: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing)
      return errorHandler({
        statusCode: STATUS_CODES.BAD_REQUEST,
        res,
        message: "User already exists!",
      });

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "STUDENT",
        studentProfile: {
          create: { name },
        },
      },
    });

    return successHandler({
      statusCode: STATUS_CODES.CREATED,
      res,
      message: "Student created",
      data: { userId: user.id },
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const signUpMentor: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing)
      return errorHandler({
        statusCode: STATUS_CODES.BAD_REQUEST,
        res,
        message: "User already exists!",
      });

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "MENTOR",
        mentorProfile: {
          create: { name },
        },
      },
    });

    return successHandler({
      statusCode: STATUS_CODES.CREATED,
      res,
      message: "Mentor created",
      data: { userId: user.id },
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student_profile: true,
        mentor_profile: true,
      },
    });

    if (!user)
      return errorHandler({
        statusCode: STATUS_CODES.BAD_REQUEST,
        res,
        message: "User not found!",
      });

    if (!user.password)
      return errorHandler({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        res,
        message: "Invalid credentials",
      });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return errorHandler({
        statusCode: STATUS_CODES.BAD_REQUEST,
        res,
        message: "Invalid credentials",
      });

    const token = jwtToken.sign(user);

    return successHandler({
      res,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile:
            user.role === "STUDENT"
              ? user.student_profile
              : user.mentor_profile,
        },
      },
    });
  } catch (err) {
    return errorHandler({ res, error: err });
  }
};

export const sendOtp: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return errorHandler({
        statusCode: STATUS_CODES.NOT_FOUND,
        res,
        message: "User not found",
      });

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

    return successHandler({
      res,
      message: "OTP sent",
      data: { otp: code },
    });
  } catch (error) {
    return errorHandler({ res, error });
  }
};

export const verifyOtp: RequestHandler = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return errorHandler({
        statusCode: STATUS_CODES.NOT_FOUND,
        res,
        message: "User not found",
      });

    const otp = await prisma.otp.findUnique({ where: { userId: user.id } });

    if (!otp || otp.code !== code || otp.expiresAt < new Date()) {
      return errorHandler({
        statusCode: STATUS_CODES.BAD_REQUEST,
        res,
        message: "Invalid OTP",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await prisma.otp.delete({ where: { userId: user.id } });

    return successHandler({
      res,
      message: "Verified successfully",
    });
  } catch (error) {
    return errorHandler({ res, error });
  }
};
