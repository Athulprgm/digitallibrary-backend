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

// ACCEPT request
router.put("/:id/accept", acceptRequest);

// REJECT request
router.put("/:id/reject", rejectRequest);

// RETURN book
router.put("/return/:id", returnBook);

// GET requests (must be LAST because it's a dynamic route)
router.get("/:id", getRequests);

module.exports = router;
