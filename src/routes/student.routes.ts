import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, isStudent } from "../middlewares/auth.middlewares";
import { errorHandler, successHandler } from "../utils/api-handlers";
import { STATUS_CODES } from "../constants/status-codes";

const studentRouter = Router();

studentRouter.put("/profile", authMiddleware, isStudent, async (req, res) => {
  try {
    const { name, dateOfBirth, educationLevel, targetCourse, targetCollege } =
      req.body;

    const profile = await prisma.studentProfile.update({
      where: { userId: req.user.id },
      data: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        educationLevel,
        targetCourse,
        targetCollege,
      },
    });

    successHandler({ res, message: "Profile updated", data: profile });
  } catch (err) {
    return errorHandler({ res, error: err });
  }
});

// GET /api/student/profile

studentRouter.get("/profile", authMiddleware, isStudent, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { student_profile: true },
    });

    if (!user) {
      return errorHandler({
        res,
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User not found",
      });
    }

    return successHandler({ res, data: user.student_profile });
  } catch (err) {
    return errorHandler({ res, error: err });
  }
});

export default studentRouter;
