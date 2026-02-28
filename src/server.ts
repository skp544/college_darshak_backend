import app from "./app";
import ENV_CONFIG from "./config/env-config";
import logger from "./config/logger";

app.listen(ENV_CONFIG.PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${ENV_CONFIG.PORT}`);
  logger.info(`Server is running on http://localhost:${ENV_CONFIG.PORT}`);
});
