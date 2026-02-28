import { Router } from "express";
import {
  generateOtpController,
  verifyOtpController,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/generate", generateOtpController);
userRouter.post("/verify", verifyOtpController);

export default userRouter;
