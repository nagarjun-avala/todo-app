const User = require("../models/user.model");

const userCtrl = {
  // Get user profile
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id; // Assuming user ID is stored in req.user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching user profile", error: error.message });
    }
  },

  // Update user profile
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.user._id; // Assuming user ID is stored in req.user
      const updatedData = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user profile", error: error.message });
    }
  },

  // Delete user profile
  deleteUserProfile: async (req, res) => {
    try {
      const userId = req.user._id; // Assuming user ID is stored in req.user
      const deletedUser = await User.find;
      ByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user profile", error: error.message });
    }
  },
};

module.exports = userCtrl;
