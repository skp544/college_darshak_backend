import { Router } from "express";
import { successHandler, errorHandler } from "../utils/api-handlers";
import { authMiddleware, isMentor } from "../middlewares/auth.middlewares";
import { prisma } from "../lib/prisma";
import { upload } from "../config/multer";
import { STATUS_CODES } from "../constants/status-codes";
import {
  updateMentorAcademicDetail,
  updateMentorPersonalDetail,
  uploadMentorDocument,
} from "../controllers/mentor.controller";

const mentorRouter = Router();

// PUT /api/v1/mentor/personal
mentorRouter.put(
  "/personal",
  authMiddleware,
  isMentor,
  updateMentorPersonalDetail,
);

// PUT /api/v1/mentor/academic
mentorRouter.put(
  "/academic",
  authMiddleware,
  isMentor,
  updateMentorAcademicDetail,
);

mentorRouter.put(
  "/mentor/documents",
  authMiddleware,
  isMentor,
  upload.fields([
    { name: "studentId", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  uploadMentorDocument,
);

// GET /api/mentor/profile

mentorRouter.get("/profile", authMiddleware, isMentor, async (req, res) => {});

export default mentorRouter;
