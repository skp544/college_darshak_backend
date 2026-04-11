import { Router } from "express";
import { successHandler, errorHandler } from "../utils/api-handlers";
import { authMiddleware, isMentor } from "../middlewares/auth.middlewares";
import { prisma } from "../lib/prisma";
import { upload } from "../config/multer";
import { STATUS_CODES } from "../constants/status-codes";

const mentorRouter = Router();

// PUT /api/mentor/personal

mentorRouter.put("/personal", authMiddleware, isMentor, async (req, res) => {
  try {
    const { name, dateOfBirth, state, city, phone, languages } = req.body;

    const profile = await prisma.mentorProfile.update({
      where: { userId: req.user.id },
      data: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        state,
        city,
        phone,
        languages,
      },
    });

    return successHandler({
      res,
      message: "Personal details updated",
      data: profile,
    });
  } catch (err) {
    return errorHandler({ res, error: err });
  }
});

// PUT /api/mentor/academic

mentorRouter.put("/academic", authMiddleware, isMentor, async (req, res) => {
  try {
    const {
      university,
      college,
      course,
      specialization,
      currentYear,
      cgpa,
      isPlaced,
      companyName,
    } = req.body;

    const profile = await prisma.mentorProfile.update({
      where: { userId: req.user.id },
      data: {
        university,
        college,
        course,
        specialization,
        currentYear,
        cgpa,
        isPlaced,
        companyName,
      },
    });

    return successHandler({
      res,
      message: "Academic details updated",
      data: profile,
    });
  } catch (err) {
    return errorHandler({ res, error: err });
  }
});

mentorRouter.put(
  "/mentor/documents",
  authMiddleware,
  isMentor,
  upload.fields([
    { name: "studentId", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const studentIdUrl = files?.studentId?.[0]?.path || null;
      const marksheetUrl = files?.marksheet?.[0]?.path || null;
      const profilePhotoUrl = files?.profilePhoto?.[0]?.path || null;

      const profile = await prisma.mentorProfile.update({
        where: { userId: req.user.id },
        data: {
          studentIdUrl,
          marksheetUrl,
          profilePhotoUrl,
          documentsVerified: false,
        },
      });

      return successHandler({
        res,
        message: "Documents uploaded successfully",
        data: profile,
      });
    } catch (err) {
      return errorHandler({ res, error: err });
    }
  },
);

// GET /api/mentor/profile

mentorRouter.get("/profile", authMiddleware, isMentor, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { mentor_profile: true },
    });

    if (!user) {
      return errorHandler({
        res,
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User not found",
      });
    }
    successHandler({ res, data: user.mentor_profile });
  } catch (err) {
    errorHandler({ res, error: err });
  }
});

export default mentorRouter;
