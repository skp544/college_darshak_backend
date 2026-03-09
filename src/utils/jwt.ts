import jwt, { JwtPayload } from "jsonwebtoken";
import ENV_CONFIG from "../config/env-config";
import { JWT_EXPIRES_IN } from "../constants";
import logger from "../config/logger";

export const jwtToken = {
  sign: (payload: JwtPayload) => {
    try {
      return jwt.sign(payload, ENV_CONFIG.JWT_SECRET as string, {
        expiresIn: JWT_EXPIRES_IN,
      });
    } catch (error) {
      //   console.log(error);
      logger.error("Failed to authentiate token", error);
      throw new Error("Failed to authentiate token");
    }
  },

  verify: (token: string) => {
    try {
      return jwt.verify(token, ENV_CONFIG.JWT_SECRET as string) as JwtPayload;
    } catch (error) {
      //   console.log(error);
      logger.error("Failed to verify token", error);
      throw new Error("Failed to verify token");
    }
  },
};
