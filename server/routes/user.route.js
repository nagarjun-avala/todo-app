const express = require("express");
const userCtrl = require("../controllers/user.controller");

const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// Define routes for user operations
router.get("/profile", auth, userCtrl.getUserProfile);
// router.put("/profile", userCtrl.updateUserProfile);
// router.delete("/profile", userCtrl.deleteUserProfile);
// router.get("/users", userCtrl.getAllUsers);
// router.get("/users/:id", userCtrl.getUserById);
// router.put("/users/:id", userCtrl.updateUserById);
// router.delete("/users/:id", userCtrl.deleteUserById);
// router.post("/users/search", userCtrl.searchUsers);
// Export the router to be used in the main application
module.exports = router;
// Note: The above code assumes that the user controller has methods defined for each of the routes.
