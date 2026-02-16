import winston from "winston";

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

const isProduction = process.env.NODE_ENV === "production";

/**
 * Custom log format for development
 */
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), //  logs stack trace
    isProduction ? json() : combine(colorize(), devFormat),
  ),

  defaultMeta: { service: "movie-booking-api" },

  transports: [
    new winston.transports.Console(),

    // Log only errors to error.log
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Log all levels to combined.log
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

export default logger;
