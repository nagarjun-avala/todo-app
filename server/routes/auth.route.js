const express = require("express");
const authCtrl = require("../controllers/auth.controller");

const router = express.Router();

// Define routes for auth operations
router.post("/register", authCtrl.registerUser);
router.post("/login", authCtrl.loginUser);

// Export the router to be used in the main application
module.exports = router;
// Note: The above code assumes that the auth controller has methods defined for each of the routes.
