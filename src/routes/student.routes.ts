import { Router } from "express";
import { authMiddleware, isStudent } from "../middlewares/auth.middlewares";
import { getMe, studentProfileUpdate } from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.put("/profile", authMiddleware, isStudent, studentProfileUpdate);

// GET /api/v1/student/profile
studentRouter.get("/profile", authMiddleware, isStudent, getMe);

export default studentRouter;
