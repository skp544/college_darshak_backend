import { Router } from "express";

const userRouter = Router();

userRouter.post("/generate", generateOtpController);
userRouter.post("/verify", verifyOtpController);

export default userRouter;
