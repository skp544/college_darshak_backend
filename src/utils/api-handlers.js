export const errorHandler = ({
  res,
  error,
  message = "Something went wrong",
  statusCode = 500,
}) => {
  res.status(statusCode).json({ message, error, data: {}, success: false });
};

export const successHandler = ({
  res,
  message = "Request completed successfully!",
  data = {},
  statusCode = 200,
}) => {
  res.status(statusCode).json({ message, data, success: true });
};
