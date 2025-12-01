const express = require("express");
const router = express.Router();

const {
  getRequests,
  createRequest,
  acceptRequest,
  rejectRequest,
  returnBook,
} = require("../controllers/requestController");

// CREATE request
router.post("/", createRequest);

// RETURN book (specific route before generic :id)
router.put("/return/:id", returnBook);

// ACCEPT request
router.put("/:id/accept", acceptRequest);

// REJECT request
router.put("/:id/reject", rejectRequest);

// GET requests (keep last to avoid conflicts)
router.get("/:id", getRequests);

module.exports = router;
