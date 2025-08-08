const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authCtrl = {
  // Register a new user
  registerUser: async (req, res) => {
    try {
      const { fullName, username, email, password } = req.body;
      if (!fullName || !username || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }
      // Check if user already exists
      let existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username or email already exists",
        });
      }

      const newUser = new User({ fullName, username, email, password });
      await newUser.save();

      res.cookie("token", generateRefreshToken(newUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "strict", // Adjust as necessary
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const accessToken = generateAccessToken(newUser);

      delete newUser._doc.password; // Remove password from response

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: newUser,
        token: accessToken,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error registering user",
        error: error.message,
      });
    }
  },

  // Login a user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
      // Compare the password with the hashed password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
      // Generate a JWT token
      res.cookie("token", generateRefreshToken(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "strict", // Adjust as necessary
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const accessToken = generateAccessToken(user);
      delete user._doc.password; // Remove password from response
      res.status(200).json({
        success: true,
        message: "Login successful",
        user,
        token: accessToken,
      });
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: "Error logging in",
        error: error.message,
      });
    }
  },

  refresh: async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.sendStatus(403);

      const newAccessToken = generateAccessToken(user._id, user.role);
      res.json({ token: newAccessToken });
    } catch (error) {
      res.status(500).json({
        sucess: false,
        message: "Error logging in",
        error: error.message,
      });
    }
  },

  refresh: async (req, res) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
    });
    res.status(200).json({ message: "Logged out" });
  },
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_SECRET_EXPIRATION || "1m",
      algorithm: "HS256",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRATION || "1d",
      algorithm: "HS256",
    }
  );
};

module.exports = authCtrl;
