import { STATUS_CODES } from "../constants/status-codes";
import { prisma } from "../lib/prisma";

import { AppError } from "../utils/AppError";

export const updateMentorPersonalDetailService = async ({
  userId,
  name,
  dateOfBirth,
  state,
  city,
  phone,
  languages,
}: {
  userId: string;
  name: string;
  dateOfBirth: string;
  state: string;
  city: string;
  phone: string;
  languages: string[];
}) => {
  try {
    if (!name || !dateOfBirth || !state || !city || !phone || !languages) {
      throw new AppError("All fields are required", STATUS_CODES.BAD_REQUEST);
    }

    const profile = await prisma.mentorProfile.upsert({
      where: { userId },
      update: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        state,
        city,
        phone,
        languages,
      },
      create: {
        userId,
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        state,
        city,
        phone,
        languages,
      },
    });

    return {
      message: "Personal details updated",
      data: profile,
    };
  } catch (error) {
    throw error;
  }
};

export const updateMentorAcademicDetailService = async ({
  userId,
  university,
  college,
  course,
  specialization,
  currentYear,
  cgpa,
  isPlaced,
  companyName,
}: {
  userId: string;
  university: string;
  college: string;
  course: string;
  specialization: string;
  currentYear: number;
  cgpa: number;
  isPlaced: boolean;
  companyName: string;
}) => {
  try {
    const profile = await prisma.mentorProfile.update({
      where: { userId: userId },
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

    return {
      message: "Academic details updated",
      data: profile,
    };
  } catch (error) {
    throw error;
  }
};

export const uploadMentorDocumentsService = async (
  userId: string,
  files: {
    [fieldname: string]: Express.Multer.File[];
  },
) => {
  try {
    const studentIdUrl = files?.studentId?.[0]?.path || null;
    const marksheetUrl = files?.marksheet?.[0]?.path || null;
    const profilePhotoUrl = files?.profilePhoto?.[0]?.path || null;

    const profile = await prisma.mentorProfile.update({
      where: { userId },
      data: {
        studentIdUrl,
        marksheetUrl,
        profilePhotoUrl,
        documentsVerified: false,
      },
    });
    return { data: profile, message: "Documents uploaded successfully" };
  } catch (error) {
    console.log("Err in service", error);
    throw error;
  }
};

export const getMeService = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { mentor_profile: true },
    });

    if (!user) {
      throw new AppError("User not found", STATUS_CODES.NOT_FOUND);
    }

    return { data: user.mentor_profile };
  } catch (error) {
    throw error;
  }
};

/*
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { STATUS_CODES } from "../constants/status-codes";

//////////////////////////////////////////////////////
// STEP 1: PERSONAL DETAILS
//////////////////////////////////////////////////////
export const createPersonalDetailsService = async ({
  userId,
  name,
  dob,
  city,
  state,
  location,
  biography,
  languages,
}: {
  userId: string;
  name: string;
  dob: Date;
  city: string;
  state: string;
  location: string;
  biography: string;
  languages: string[];
}) => {
  if (!userId) {
    throw new AppError("User not authenticated", STATUS_CODES.UNAUTHORIZED);
  }

  // Check existing mentor
  let mentor = await prisma.mentorDetails.findUnique({
    where: { userId },
  });

  if (!mentor) {
    mentor = await prisma.mentorDetails.create({
      data: {
        userId,
        name,
        dob,
        city,
        state,
        location,
        biography,
      },
    });
  } else {
    mentor = await prisma.mentorDetails.update({
      where: { userId },
      data: {
        name,
        dob,
        city,
        state,
        location,
        biography,
      },
    });
  }

  //////////////////////////////////////////////////////
  // LANGUAGES (RESET + INSERT)
  //////////////////////////////////////////////////////
  if (languages?.length) {
    await prisma.mentorLanguages.deleteMany({
      where: { mentorId: mentor.id },
    });

    await prisma.mentorLanguages.createMany({
      data: languages.map((lang) => ({
        mentorId: mentor.id,
        language: lang,
      })),
    });
  }

  return {
    message: "Personal details saved",
    data: mentor,
  };
};

//////////////////////////////////////////////////////
// STEP 2: ACADEMIC DETAILS
//////////////////////////////////////////////////////
export const createAcademicDetailsService = async ({
  userId,
  university,
  course,
  specialization,
  currentYear,
  courseType,
  courseDuration,
  currentCGPA,
  lastSemAttendance,
  placed,
  companyName,
  hostelAvail,
}: {
  userId: string;
  university: string;
  course: string;
  specialization: string;
  currentYear: number;
  courseType: string;
  courseDuration: string;
  currentCGPA: number;
  lastSemAttendance: number;
  placed: boolean;
  companyName?: string;
  hostelAvail: boolean;
}) => {
  const mentor = await prisma.mentorDetails.findUnique({
    where: { userId },
  });

  if (!mentor) {
    throw new AppError(
      "Complete personal details first",
      STATUS_CODES.BAD_REQUEST,
    );
  }

  let academic = await prisma.academicDetails.findUnique({
    where: { mentorId: mentor.id },
  });

  if (!academic) {
    academic = await prisma.academicDetails.create({
      data: {
        mentorId: mentor.id,
        university,
        course,
        specialization,
        currentYear,
        courseType,
        courseDuration,
        currentCGPA,
        lastSemAttendance,
        placed,
        companyName,
        hostelAvail,
        marksheetUrl: "", // filled later
        profilePhotoUrl: "", // filled later
        studentIdCardUrl: "", // filled later
      },
    });
  } else {
    academic = await prisma.academicDetails.update({
      where: { mentorId: mentor.id },
      data: {
        university,
        course,
        specialization,
        currentYear,
        courseType,
        courseDuration,
        currentCGPA,
        lastSemAttendance,
        placed,
        companyName,
        hostelAvail,
      },
    });
  }

  return {
    message: "Academic details saved",
    data: academic,
  };
};

//////////////////////////////////////////////////////
// STEP 3: DOCUMENT UPLOAD + FINAL SUBMIT
//////////////////////////////////////////////////////
export const uploadDocumentsService = async ({
  userId,
  marksheetUrl,
  profilePhotoUrl,
  studentIdCardUrl,
}: {
  userId: string;
  marksheetUrl: string;
  profilePhotoUrl: string;
  studentIdCardUrl: string;
}) => {
  const mentor = await prisma.mentorDetails.findUnique({
    where: { userId },
    include: { academicDetails: true },
  });

  if (!mentor || !mentor.academicDetails) {
    throw new AppError(
      "Complete previous steps first",
      STATUS_CODES.BAD_REQUEST,
    );
  }

  //////////////////////////////////////////////////////
  // UPDATE DOCUMENTS
  //////////////////////////////////////////////////////
  await prisma.academicDetails.update({
    where: { mentorId: mentor.id },
    data: {
      marksheetUrl,
      profilePhotoUrl,
      studentIdCardUrl,
    },
  });

  //////////////////////////////////////////////////////
  // MARK PROFILE COMPLETE
  //////////////////////////////////////////////////////
  await prisma.user.update({
    where: { id: userId },
    data: {
      profileCompleted: true,
    },
  });

  return {
    message: "Profile completed successfully",
  };
};
*/
