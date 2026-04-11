import { Router } from "express";
import {
  login,
  sendOtp,
  signUpMentor,
  signUpStudent,
  verifyOtp,
} from "../controllers/auth.controller";

const authRouter = Router();

// authRouter.post("/generate", generateOtpController);
// authRouter.post("/verify", verifyOtpController);

// new routes

authRouter.post("signup/student", signUpStudent);

authRouter.post("/signup/mentor", signUpMentor);

authRouter.post("/login", login);

authRouter.post("/send-otp", sendOtp);

authRouter.post("/verify-otp", verifyOtp);

export default authRouter;
