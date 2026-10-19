import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protectAdminOrStaff =
async (req, res, next) => {

  try {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Admin Check
    try {

      const admin = jwt.verify(
        token,
        process.env.ADMIN_JWT_ACCESS_SECRET
      );

      if (admin.type === "admin") {
        req.admin = admin;
        return next();
      }

    } catch (err) {}

    // Staff Check
    let staff = null;
    try {

      staff = jwt.verify(
        token,
        process.env.STAFF_SECRET
      );

    } catch (err) {}

    if (staff) {
      // Deactivated / deleted staff lose access immediately (login already refuses them).
      const account = staff.id
        ? await prisma.staffUser.findUnique({
            where: { id: Number(staff.id) },
            select: { status: true },
          })
        : null;

      if (!account) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      if (account.status === false) {
        return res.status(403).json({
          success: false,
          message: "Account is inactive. Please contact administrator.",
        });
      }

      req.staff = staff;
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};