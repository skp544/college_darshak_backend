import "dotenv/config";

const ENV_CONFIG = {
  PORT: process.env.PORT,
};

export default ENV_CONFIG;

export type ENV_CONFIG = typeof ENV_CONFIG;
