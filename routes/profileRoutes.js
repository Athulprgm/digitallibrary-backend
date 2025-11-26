const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model for the new route

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  getProfile,
  updateProfile,
  uploadPhoto,
  changePassword,
} = require("../controllers/profileController");

// @route   GET /api/profile
// @desc    Get current logged-in user's profile
router.get("/", auth, getProfile);

// ---------------------------------------------------------
// NEW FIX: Get Specific User Profile by ID
// This handles the request: GET /api/profile/654abc...
// ---------------------------------------------------------
router.get("/:id", auth, async (req, res) => {
  try {
    // Find user by ID, excluding the password
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Fetch profile error:", err.message);
    // If the ID format is wrong (not a valid MongoDB ID)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/profile
// @desc    Update profile details
router.put("/", auth, updateProfile);

// @route   PUT /api/profile/photo
// @desc    Upload profile photo
router.put("/photo", auth, upload.single("photo"), uploadPhoto);

// @route   PUT /api/profile/change-password
// @desc    Change password
router.put("/change-password", auth, changePassword);

module.exports = router;