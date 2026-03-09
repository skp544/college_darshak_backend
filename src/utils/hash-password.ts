import bcrypt from "bcrypt";
import logger from "../config/logger";

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    logger.error("Failed to hash password", error);
    throw new Error("Failed to hash password");
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error("Failed to compare password", error);
    throw new Error("Failed to compare password");
  }
};
