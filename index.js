const express = require("express");
const config = require("config");
const logger = require("./setup/logger");
const app = express();

if (!config.get("JWTSecret")) {
  logger.error("JWT not set, exiting....");
  process.exit(1);
}
app.use(express.json());
require("./setup/db")();
require("./setup/routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
});
