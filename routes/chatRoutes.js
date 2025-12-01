const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getChatUsers,
  getMessages,
  sendMessage,
  getUnreadCount
} = require("../controllers/chatController");

// IMPORTANT: specific routes FIRST
router.get("/users", auth, getChatUsers);
router.get("/getUnreadCount", auth, getUnreadCount);  // <-- MUST be above :id

// Dynamic routes LAST
router.get("/:id", auth, getMessages);
router.post("/:id", auth, sendMessage);

module.exports = router;
