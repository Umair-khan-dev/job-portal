import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getSecret = () => process.env.JWT_SECRET || "dev_secret";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, getSecret());
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found. Please log in again." });
    }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
      });
    }
    return res.status(401).json({
      message: "Invalid token. Please log out and log in again.",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const candidateOnly = (req, res, next) => {
  if (req.user?.role !== "candidate") {
    return res.status(403).json({ message: "Candidate access required" });
  }
  next();
};
