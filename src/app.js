import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./config/logger.js";
import { errorHandler, successHandler } from "./utils/api-handlers.js";

const app = express();

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  successHandler({
    message: "Welcome to College Darshak API",
    success: true,
    res,
  });
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ message: "Server is Healthy!", status: "Healthy", success: true });
});

app.use((req, res) => {
  errorHandler({ res, message: "Not found", statusCode: 404 });
});

export default app;
