const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  // send all not sensitive server information data
  res.send({
    message: "Welcome to the API",
    version: "0.0.1",
    success: true,
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", require("./auth.route"));
router.use("/users", require("./user.route"));

module.exports = router;
