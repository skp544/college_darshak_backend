import { Router } from "express";
import { authMiddleware, isMentor } from "../middlewares/auth.middlewares";
import { upload } from "../config/multer";
import {
  getMe,
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

// PUT /api/v1/mentor/documents
mentorRouter.put(
  "/documents",
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
mentorRouter.get("/profile", authMiddleware, isMentor, getMe);

export default mentorRouter;
