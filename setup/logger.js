const winston = require("winston");

/*
*an exported function to handle all logs
*/
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    //all logs with level of error should be written to a error.log file
    new winston.transports.File({
      filename: "error.log",
      level: "error"
    }),
    //all logs with level of info should be written to a info.log file
    new winston.transports.File({
      filename: "info.log",
      level: "info"
    })
  ]
});

process.on("unhandledRejection", ex => {
  logger.error(ex.message);
  process.exit(1);
});

if (process.env !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

module.exports = logger;
