import { STATUS_CODES } from "../constants/status-codes";
import { prisma } from "../lib/prisma";
import { errorHandler, successHandler } from "../utils/api-handlers";
import { AppError } from "../utils/AppError";

export const studentProfileUpdateService = async ({
  userId,
  name,
  dateOfBirth,
  educationLevel,
  targetCourse,
  targetCollege,
}: {
  userId: string;
  name: string;
  dateOfBirth: string;
  educationLevel: string;
  targetCourse: string;
  targetCollege: string;
}) => {
  try {
    if (
      !name ||
      !dateOfBirth ||
      !educationLevel ||
      !targetCourse ||
      !targetCollege
    ) {
      throw new AppError("All fields are required", STATUS_CODES.BAD_REQUEST);
    }
    const profile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        educationLevel,
        targetCourse,
        targetCollege,
      },
    });

    return {
      data: profile,
      message: "Profile updated",
    };
  } catch (err) {
    throw err;
  }
};

export const getMeService = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student_profile: true },
    });

    if (!user) {
      throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
    }

    return {
      data: user.student_profile,
    };
  } catch (error) {
    throw error;
  }
};
