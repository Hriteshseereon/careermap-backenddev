import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_ACCESS_SECRET
    );

    // 🔥 Important check
    if (decoded.type !== "admin") {
      return res.status(401).json({ message: "Not an admin token" });
    }

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};