import "dotenv/config";

const ENV_CONFIG = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default ENV_CONFIG;

export type ENV_CONFIG = typeof ENV_CONFIG;
