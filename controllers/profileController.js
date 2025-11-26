const User = require("../models/User");
const bcrypt = require("bcryptjs");


// =============================
// CHANGE PASSWORD
// =============================
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
  res.json(user);
};

exports.uploadPhoto = async (req, res) => {
  const photoPath = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { photo: photoPath },
    { new: true }
  ).select("-password");

  res.json({ message: "Photo updated", photo: photoPath, user });
};
