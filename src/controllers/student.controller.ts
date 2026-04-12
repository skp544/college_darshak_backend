import { RequestHandler } from "express";
import { successHandler, errorHandler } from "../utils/api-handlers";
import {
  getMeService,
  studentProfileUpdateService,
} from "../services/student.service";

export const studentProfileUpdate: RequestHandler = async (req, res) => {
  try {
    const { name, dateOfBirth, educationLevel, targetCourse, targetColleges } =
      req.body;

    const response = await studentProfileUpdateService({
      userId: req.user.id,
      name,
      dateOfBirth,
      educationLevel,
      targetCourse,
      targetColleges,
    });

    successHandler({
      res,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

export const getMe: RequestHandler = async (req, res) => {
  try {
    const response = await getMeService(req.user.id);

    successHandler({ res, data: response.data });
  } catch (err) {
    errorHandler({ res, error: err });
  }
};
