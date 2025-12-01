const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.header("Authorization");
  
  console.log("Auth header:", header); // Debug log

  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "No token, authorization denied" });

  const token = header.split(" ")[1];
  console.log("Token:", token.substring(0, 20) + "..."); // Debug log

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    console.log("Decoded user:", decoded); // Debug log
    req.user = { id: decoded.id };
    next();

  } catch (err) {
    console.log("Token verification error:", err.message); // Debug log
    res.status(401).json({ message: "Invalid token" });
  }
};