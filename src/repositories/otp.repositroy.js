export const createOtp = async ({ identifier, identifierType, otp }) => {
  await prisma.otpSchema.deleteMany({ where: { identifier } });

  return prisma.otpSchema.create({
    data: {
      identifier,
      identifierType,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
};

export const verifyOtp = async ({ identifier, otp }) => {
  return prisma.otpSchema.findFirst({
    where: {
      identifier,
      otp,
      expiresAt: { gt: new Date() },
    },
  });
};

export const deleteOtps = async (identifier) => {
  return prisma.otpSchema.deleteMany({
    where: { identifier },
  });
};
