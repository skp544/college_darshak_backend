import { RequestHandler } from "express";
import { errorHandler } from "../utils/api-handlers";
import { jwtToken } from "../utils/jwt";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorHandler({ res, message: "Authentication failed" });
    }

    const decodedToken = jwtToken.verify(token);
  } catch (err) {
    errorHandler({ res, error: err });
  }
};
