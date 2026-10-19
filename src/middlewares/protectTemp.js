import jwt from "jsonwebtoken";

// Signup is only allowed with the temp token issued by /api/auth/verify-otp (type "signup").
// Both the web portal and the mobile app send it as "Authorization: Bearer <tempToken>".
// (The old fallback that trusted req.body.mobile let anyone register any mobile without an OTP.)
export const protectTemp = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Mobile verification required. Please verify OTP again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded.mobile || decoded.type !== "temp") {
      return res.status(401).json({ message: "Invalid temp token" });
    }
    req.user = decoded; // contains mobile
    return next();
  } catch {
    return res.status(401).json({ message: "Temp token expired or invalid" });
  }
};
