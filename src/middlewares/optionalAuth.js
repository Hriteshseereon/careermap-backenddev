import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded?.id) {
      req.user = decoded;
    }
  } catch {
    // Ignore invalid tokens for optional auth routes.
  }

  next();
};
