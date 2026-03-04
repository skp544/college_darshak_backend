import { prisma } from "../lib/prisma";
import { CollegeType } from "../types";
import { AppError } from "../utils/AppError";

export const createCollegeService = async (data: {
  collegeName: string;
  description: string;
  established: string;
  type: CollegeType;
  location: string;
  state: string;
  accreditation: string;
  phoneNo: string;
  website: string;
  courses?: string[];
}) => {
  const { courses, ...collegeData } = data;

  await prisma.college.create({
    data: {
      ...collegeData,
      courses: courses
        ? {
            create: courses.map((course) => ({
              courseName: course,
            })),
          }
        : undefined,
    },
  });

  return {
    message: "College created successfully!",
  };
};

export const getAllCollegesService = async () => {
  const result = await prisma.college.findMany({
    include: {
      courses: true,
    },
  });

  return { data: result || [] };
};

export const getCollegeByIdService = async (id: string) => {
  const result = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
    },
  });

  if (!result) {
    throw new AppError("College not found", 404);
  }

  return { data: result };
};

export const updateCollegeService = async (
  id: string,
  data: {
    collegeName?: string;
    description?: string;
    established?: string;
    type?: CollegeType;
    location?: string;
    state?: string;
    accreditation?: string;
    phoneNo?: string;
    website?: string;
    courses?: string[];
  },
) => {
  const { courses, ...collegeData } = data;

  const college = await prisma.college.findUnique({
    where: { id },
  });

  if (!college) {
    throw new AppError("College not found", 404);
  }

  // If courses provided → delete old + recreate
  if (courses) {
    await prisma.collegeCourses.deleteMany({
      where: { collegeId: id },
    });
  }

  const result = await prisma.college.update({
    where: { id },
    data: {
      ...collegeData,
      courses: courses
        ? {
            create: courses.map((course) => ({
              courseName: course,
            })),
          }
        : undefined,
    },
    include: {
      courses: true,
    },
  });

  return { data: result, message: "College updated successfully!" };
};

/*************  ************  *************/
/**
 * Deletes a college with the given ID.
 *
 * @throws {AppError} if the college with the given ID is not found.
 *
 * @param {string} id - The ID of the college to be deleted.
 *
 * @returns {Promise<{data: any, message: string}>} - A promise resolving to an object with the deleted college data and a success message.
 */
/*******  ************  *******/ //
export const deleteCollegeService = async (id: string) => {
  const college = await prisma.college.findUnique({
    where: { id },
  });

  if (!college) {
    throw new AppError("College not found", 404);
  }

  const result = await prisma.college.delete({
    where: { id },
  });

  return { data: result, message: "College deleted successfully!" };
};
