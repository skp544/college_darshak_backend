export const ROLES = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  MENTOR: "MENTOR",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const MENTOR_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type MentorStatus = (typeof MENTOR_STATUS)[keyof typeof MENTOR_STATUS];

export const IDENTIFIER_TYPE = {
  EMAIL: "EMAIL",
  PHONE: "PHONE",
} as const;

export type IdentifierType =
  (typeof IDENTIFIER_TYPE)[keyof typeof IDENTIFIER_TYPE];

export const COLLEGE_TYPE = {
  GOVERNMENT: "GOVERNMENT",
  PRIVATE: "PRIVATE",
  SEMIGOVERNMENT: "SEMIGOVERNMENT",
} as const;

export type CollegeType = (typeof COLLEGE_TYPE)[keyof typeof COLLEGE_TYPE];

export const EDUCATION_LEVEL = {
  SECONDARY: "SECONDARY",
  SENIOR_SECONDARY: "SENIOR_SECONDARY",
  UNDERGRADUATE: "UNDERGRADUATE",
  POSTGRADUATE: "POSTGRADUATE",
} as const;

export type EducationLevel =
  (typeof EDUCATION_LEVEL)[keyof typeof EDUCATION_LEVEL];

export const AUTH_PROVIDER = {
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
  GOOGLE: "GOOGLE",
  OTP: "OTP",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
