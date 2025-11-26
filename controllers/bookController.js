const Book = require("../models/Book");

exports.addBook = async (req, res) => {
  try {
    let imagePath = "uploads/default.jpg";

    if (req.file) {
      imagePath = `uploads/${req.file.filename}`;
    }

    const newBook = new Book({
      userId: req.body.userId,
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      image: imagePath,
      status: "Available",
    });

    const savedBook = await newBook.save();
    res.status(201).json({ success: true, data: savedBook });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving book",
      error: error.message,
    });
  }
};

exports.getBooksByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const books = await Book.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user books",
    });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const search = req.query.search || "";      // FIXED
    const genre = req.query.genre || "All";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {};

    // FIXED: Search by title OR author
    if (search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

    // Genre filter
    if (genre !== "All" && genre.trim() !== "") {
      filter.genre = genre;
    }

    const skip = (page - 1) * limit;

    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching books",
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = `uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating book",
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting book",
    });
  }
};
