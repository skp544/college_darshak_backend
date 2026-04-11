import { RequestHandler } from "express";
import { errorHandler } from "../utils/api-handlers";
import { jwtToken } from "../utils/jwt";
import { Role, ROLES } from "../constants/enums";
import { prisma } from "../lib/prisma";
import { STATUS_CODES } from "../constants/status-codes";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: Role;
      };
    }
  }
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return errorHandler({
        res,
        message: "Unauthorized",
        statusCode: STATUS_CODES.UNAUTHORIZED,
      });

    const decoded = jwtToken.verify(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user)
      return errorHandler({
        res,
        message: "Unauthorized Request User not found",
        statusCode: STATUS_CODES.UNAUTHORIZED,
      });

    req.user = { id: user.id, role: user.role };

    next();
  } catch (error) {
    return errorHandler({ res, error, message: "Unauthorized" });
  }
};

export const isStudent: RequestHandler = async (req, res, next) => {
  try {
    if (req.user.role === ROLES.STUDENT) {
      next();
    } else {
      return errorHandler({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Unauthorized Request",
        res,
      });
    }
  } catch (error) {
    return errorHandler({ res, error });
  }
};

export const isMentor: RequestHandler = async (req, res, next) => {
  try {
    if (req.user.role === ROLES.MENTOR) {
      next();
    } else {
      return errorHandler({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Unauthorized Request",
        res,
      });
    }
  } catch (error) {
    return errorHandler({ res, error });
  }
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    if (req.user.role === ROLES.ADMIN) {
      next();
    } else {
      return errorHandler({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Unauthorized Request",
        res,
      });
    }
  } catch (error) {
    return errorHandler({ res, error });
  }
};
