const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require("../middleware/upload");
const Book = require("../models/Book");

router.post("/add", upload.single("image"), bookController.addBook);

router.get("/", bookController.getBooks);
router.get("/user/:userId", bookController.getBooksByUser);

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching book" });
  }
});

router.put("/:id", upload.single("image"), bookController.updateBook);

router.delete("/:id", bookController.deleteBook);

module.exports = router;
