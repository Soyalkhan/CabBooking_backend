import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ msg: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// Optional auth - doesn't fail if no token, just sets req.user if available
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (err) {
    req.user = null;
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};
