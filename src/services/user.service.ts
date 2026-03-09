import { EducationLevel } from "../constants/enums";
import { STATUS_CODES } from "../constants/status-codes";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const setupStudentProfileService = async ({
  name,
  dob,
  educationLevel,
  targetCourse,
  targetColleges,
}: {
  name: string;
  dob: string;
  educationLevel: EducationLevel;
  targetCourse: string;
  targetColleges: string;
}) => {
  if (!name || !dob || !educationLevel || !targetCourse || !targetColleges) {
    throw new AppError("All fields are required", STATUS_CODES.BAD_REQUEST);
  }

  const profile = await prisma.studentDetails.create({
    data: {
      name,
      dob,
      educationLevel,
      targetCourse,
      targetColleges,
    },
  });

  return { data: profile, message: "Profile created successfully!" };
};
