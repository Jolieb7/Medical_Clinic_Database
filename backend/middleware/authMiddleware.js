//Middleware Authentication (not complete - )
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "superscretkey";

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

const authorizeReceptionist = (req, res, next) => {
  if (!req.user || req.user.role !== "Receptionist") {
    return res.status(403).json({ error: "Access denied. Receptionists only." });
  }
  next();
};

module.exports = { authenticateUser, authorizeReceptionist };

