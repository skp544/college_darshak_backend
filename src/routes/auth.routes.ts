import { Router } from "express";
import {
  login,
  sendOtp,
  signUpMentor,
  signUpStudent,
  verifyOtp,
} from "../controllers/auth.controller";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { Role } from "../../generated/prisma/enums";
import { errorHandler, successHandler } from "../utils/api-handlers";
import { STATUS_CODES } from "../constants/status-codes";

const authRouter = Router();

// authRouter.post("/generate", generateOtpController);
// authRouter.post("/verify", verifyOtpController);

// new routes

authRouter.post("/signup/student", signUpStudent);

authRouter.post("/signup/mentor", signUpMentor);

authRouter.post("/login", login);

authRouter.post("/send-otp", sendOtp);

authRouter.post("/verify-otp", verifyOtp);

// GET /api/me

authRouter.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      student_profile: true,
      mentor_profile: true,
    },
  });

  if (!user) {
    return errorHandler({
      res,
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "User not found",
    });
  }

  successHandler({
    res,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      profile:
        user.role === Role.STUDENT ? user.student_profile : user.mentor_profile,
    },
  });
});

export default authRouter;
