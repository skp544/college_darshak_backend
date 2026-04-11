import { RequestHandler } from "express";
import { errorHandler, successHandler } from "../utils/api-handlers";
import { STATUS_CODES } from "../constants/status-codes";
import {
  loginService,
  signUpMentorService,
  signUpStudentService,
} from "../services/auth.service";
import { sendOtpService, verifyOtpService } from "../services/otp.service";

export const signUpStudent: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await signUpStudentService({ email, password });

    return successHandler({
      statusCode: STATUS_CODES.CREATED,
      res,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const signUpMentor: RequestHandler = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const response = await signUpMentorService({ email, password });

    return successHandler({
      statusCode: STATUS_CODES.CREATED,
      res,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    return errorHandler({
      res,
      error,
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await loginService({ email, password });

    return successHandler({
      res,
      message: response.message,
      data: response.data,
    });
  } catch (err) {
    return errorHandler({ res, error: err });
  }
};

export const sendOtp: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    const response = await sendOtpService({ email });

    return successHandler({
      res,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    return errorHandler({ res, error });
  }
};

export const verifyOtp: RequestHandler = async (req, res) => {
  try {
    const { email, code } = req.body;

    const response = await verifyOtpService({ email, code });
    return successHandler({
      res,
      message: response.message,
    });
  } catch (error) {
    return errorHandler({ res, error });
  }
};

/*
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
*/
