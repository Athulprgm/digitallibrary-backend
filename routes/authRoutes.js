const express = require("express");
const {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Forgot Password → email reset link
router.post("/forgot-password", forgotPassword);

// Reset Password → final step
router.post("/reset-password/:token", resetPassword);

module.exports = router;
