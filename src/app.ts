import express from "express";
import logger from "./config/logger";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/error-handler.middlewares";
import { errorHandler, successHandler } from "./utils/api-handlers";
import { STATUS_CODES } from "./constants/status-codes";
import authRouter from "./routes/auth.routes";
import collegeRouter from "./routes/college.routes";
import studentRouter from "./routes/student.routes";
import mentorRouter from "./routes/mentor.routes";

const app = express();

/* ======================
   Security & Utilities
====================== */
app.use(cors());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

/* ======================
   Logging
====================== */
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  }),
);

/* ======================
   Body Parsers
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   Routes 
====================== */

app.get("/api", (_req, res) => {
  successHandler({
    message: "Welcome to College Decode API",
    res,
  });
});

app.get("/health", (_req, res) => {
  res
    .status(STATUS_CODES.SUCCESS)
    .json({ message: "Server is Healthy!", status: "Healthy", success: true });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/college", collegeRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/mentor", mentorRouter);

/* ======================
   404 Handler 
====================== */
app.use((_req, res) => {
  errorHandler({
    res,
    statusCode: STATUS_CODES.NOT_FOUND,
    message: "Route not found",
  });
});

/* ======================
   Global Error Handler 
====================== */
app.use(globalErrorHandler);

export default app;
