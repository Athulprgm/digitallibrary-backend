require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

// Database connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const requestRoutes = require("./routes/requestRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Multer Error Handler
const handleMulterErrors = require("./middleware/uploadError");

// Socket.io
const { initSocket } = require("./socket");

// ----------------------
// App setup
// ----------------------
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json()); // parse JSON requests

// Serve static files
app.use("/uploads", express.static("uploads"));

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chat", chatRoutes);

// Multer upload error handler (after routes that use multer)
app.use(handleMulterErrors);

// ----------------------
// Socket.io initialization
// ----------------------
initSocket(server); // pass the HTTP server

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
