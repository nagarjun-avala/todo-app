// middleware/logger.js
const fs = require("fs");
const path = require("path");

const logStream = fs.createWriteStream(
  path.join(__dirname, "../logs/requests.log"),
  { flags: "a" }
);

const requestLogger = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const log = `[${timestamp}] ${method} ${url} ,IP ${ip}\n`;

  console.log(log); // log to console
  logStream.write(log); // log to file

  next();
};

module.exports = requestLogger;
