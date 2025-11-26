// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const requestRoutes = require("./routes/requestRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Multer Error Handler
const handleMulterErrors = require("./middleware/uploadError");

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Connect Database
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/profile", profileRoutes);

// Multer error handling middleware
app.use(handleMulterErrors);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});