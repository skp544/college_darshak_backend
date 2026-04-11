import { Router } from "express";
import {
  getMe,
  login,
  sendOtp,
  signUpMentor,
  signUpStudent,
  verifyOtp,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";

const authRouter = Router();

// authRouter.post("/generate", generateOtpController);
// authRouter.post("/verify", verifyOtpController);

// new routes

authRouter.post("/signup/student", signUpStudent);

authRouter.post("/signup/mentor", signUpMentor);

authRouter.post("/login", login);

authRouter.post("/send-otp", sendOtp);

authRouter.post("/verify-otp", verifyOtp);

// GET /api/v1/auth/me

authRouter.get("/me", authMiddleware, getMe);

export default authRouter;
