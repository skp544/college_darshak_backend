import { RequestHandler } from "express";
import { errorHandler, successHandler } from "../utils/api-handlers";
import { setupStudentProfileService } from "../services/user.service";
import { STATUS_CODES } from "../constants/status-codes";

export const setupStudentProfile: RequestHandler = async (req, res) => {
  try {
    const { name, dob, educationLevel, targetCourse, targetColleges } =
      req.body;

    const result = await setupStudentProfileService({
      name,
      dob,
      educationLevel,
      targetCourse,
      targetColleges,
    });

    successHandler({
      res,
      message: result.message,
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (err) {
    errorHandler({ res, error: err });
  }
};
