import { Router } from "express";
import {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  setFeaturedCollege,
} from "../controllers/college.controller";

const collegeRouter = Router();

collegeRouter.post("/", createCollege);

collegeRouter.get("/", getAllColleges);

collegeRouter.get("/:id/single", getCollegeById);

collegeRouter.put("/:id/update", updateCollege);

collegeRouter.delete("/:id/delete", deleteCollege);

collegeRouter.patch("/:id/feature", setFeaturedCollege);

export default collegeRouter;
