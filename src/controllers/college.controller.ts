import { RequestHandler } from "express";
import { errorHandler, successHandler } from "../utils/api-handlers";
import {
  createCollegeService,
  getAllCollegesService,
  getCollegeByIdService,
  updateCollegeService,
  deleteCollegeService,
} from "../services/college.service";

export const createCollege: RequestHandler = async (req, res) => {
  try {
    const result = await createCollegeService(req.body);
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

/**
 * Get All Colleges
 */
export const getAllColleges: RequestHandler = async (req, res) => {
  try {
    const result = await getAllCollegesService();

    successHandler({
      res,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

/**
 * Get College By ID
 */
export const getCollegeById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getCollegeByIdService(id as string);
    successHandler({
      res,
      data: result.data,
    });
  } catch (error) {
    errorHandler({
      res,
      error,
    });
  }
};

/**
 * Update College
 */
export const updateCollege: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await updateCollegeService(id as string, req.body);

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

/**
 * Delete College
 */
export const deleteCollege: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteCollegeService(id as string);

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
