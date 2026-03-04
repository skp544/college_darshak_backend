import { Router } from "express";
import {
  generateOtpController,
  verifyOtpController,
} from "../controllers/auth.controller";

const userRouter = Router();

userRouter.post("/generate", generateOtpController);
userRouter.post("/verify", verifyOtpController);

export default userRouter;
