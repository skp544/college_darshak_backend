import app from "./app.js";
import ENV_CONFIG from "./config/env-config.js";
import logger from "./config/logger.js";

app.listen(ENV_CONFIG.PORT, () => {
  logger.info(`Server running on port ${ENV_CONFIG.PORT}`);
});
