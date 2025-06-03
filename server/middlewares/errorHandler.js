// middleware/errorHandler.js
const fs = require("fs");
const path = require("path");

const errorLogStream = fs.createWriteStream(
  path.join(__dirname, "../logs/errors.log"),
  { flags: "a" }
);

const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const errorLog = `[${timestamp}] ERROR at ${req.method} ${req.originalUrl} from ${ip}:\n${err.stack}\n\n`;

  console.error(errorLog); // console
  errorLogStream.write(errorLog); // file

  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
};

module.exports = errorHandler;
