import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protectAuth = async (req, res, next) => {
  let decoded;
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ✅ Ensure it's a real user token
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid auth token" });
    }
  } catch {
    return res.status(401).json({ message: "Token invalid or expired" });
  }

  try {
    // Banned / deleted accounts lose access immediately instead of when the token expires.
    const account = await prisma.users.findUnique({
      where: { id: Number(decoded.id) },
      select: { status: true },
    });

    if (!account) {
      return res.status(401).json({ message: "User not found" });
    }
    if (account.status === "banned") {
      return res.status(403).json({ message: "Your account has been banned. Contact support." });
    }
  } catch (error) {
    return next(error);
  }

  req.user = decoded;
  next();
};
