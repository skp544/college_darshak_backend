import { RequestHandler } from "express";
import {
  loginWithPasswordService,
  signUpWithPasswordService,
} from "../services/auth.service";
import { successHandler, errorHandler } from "../utils/api-handlers";
import { STATUS_CODES } from "../constants/status-codes";
import { generateOtpService, verifyOtpService } from "../services/otp.service";
import {
  createAcademicDetailsService,
  createPersonalDetailsService,
  uploadDocumentsService,
} from "../services/mentor.service";

export const generateOtpController: RequestHandler = async (req, res) => {
  try {
    const { identifier, identifierType } = req.body;

    const result = await generateOtpService({
      identifier,
      identifierType,
    });

    return successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const verifyOtpController: RequestHandler = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const result = await verifyOtpService({
      identifier,
      otp,
    });

    successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const signUpWithPassword: RequestHandler = async (req, res) => {
  try {
    const { identifier, identifierType, password } = req.body;

    const result = await signUpWithPasswordService({
      identifier,
      identifierType,
      password,
    });

    successHandler({
      statusCode: STATUS_CODES.CREATED,
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

export const signInWithPassword: RequestHandler = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const result = await loginWithPasswordService({
      identifier,
      password,
    });

    successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

export const createMentorPersonalDetails: RequestHandler = async (req, res) => {
  try {
    const result = await createPersonalDetailsService(req.body);

    successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

export const createAcademicDetails: RequestHandler = async (req, res) => {
  try {
    const result = await createAcademicDetailsService(req.body);

    successHandler({
      res,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

export const uploadDocument: RequestHandler = async (req, res) => {
  try {
    const result = await uploadDocumentsService(req.body);

    successHandler({
      res,
      message: result.message,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};
