import { RequestHandler } from "express";
import { successHandler, errorHandler } from "../utils/api-handlers";
import {
  getMeService,
  updateMentorAcademicDetailService,
  updateMentorPersonalDetailService,
  uploadMentorDocumentsService,
} from "../services/mentor.service";

export const updateMentorPersonalDetail: RequestHandler = async (req, res) => {
  try {
    const { name, dateOfBirth, state, city, phone, languages } = req.body;

    const response = await updateMentorPersonalDetailService({
      userId: req.user.id,
      name,
      dateOfBirth,
      state,
      city,
      phone,
      languages,
    });

    successHandler({
      res,
      message: response.message,
      data: response.data,
    });
  } catch (err) {
    errorHandler({ res, error: err });
  }
};

export const updateMentorAcademicDetail: RequestHandler = async (req, res) => {
  try {
    const {
      university,
      college,
      course,
      specialization,
      currentYear,
      cgpa,
      isPlaced,
      companyName,
    } = req.body;

    const response = await updateMentorAcademicDetailService({
      userId: req.user.id,
      university,
      college,
      course,
      specialization,
      currentYear,
      cgpa,
      isPlaced,
      companyName,
    });

    successHandler({
      res,
      message: response.message,
      data: response.data,
    });
  } catch (err) {
    errorHandler({ res, error: err });
  }
};

export const uploadMentorDocument: RequestHandler = async (req, res) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    console.log(files, "files");

    const response = await uploadMentorDocumentsService(req.user.id, files);

    successHandler({
      res,
      message: response.message,
      data: response.data,
    });
  } catch (err) {
    console.log(err);
    errorHandler({ res, error: err });
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
