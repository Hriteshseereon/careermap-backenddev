import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

/**
 * Middleware that allows:
 * 1. Admin users (ADMIN_JWT_ACCESS_SECRET)
 * 2. Staff / Counselors (STAFF_SECRET)
 * 3. Institutes (INSTITUTE_SECRET)
 */
export const protectAdminOrStaffOrInstitute = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // 1. Check Admin
    try {
      const admin = jwt.verify(token, process.env.ADMIN_JWT_ACCESS_SECRET);
      if (admin && admin.type === "admin") {
        req.admin = admin;
        return next();
      }
    } catch (err) {}

    // 2. Check Staff / Counselor
    let staff = null;
    try {
      staff = jwt.verify(token, process.env.STAFF_SECRET);
    } catch (err) {}

    if (staff) {
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

    // 3. Check Institute
    let institute = null;
    try {
      institute = jwt.verify(token, process.env.INSTITUTE_SECRET);
    } catch (err) {}

    if (institute && institute.type === "institute") {
      const account = await prisma.institutes.findUnique({
        where: { id: Number(institute.instituteId) },
        select: { status: true },
      });

      if (!account || account.status === false) {
        return res.status(401).json({
          success: false,
          message: "Institute account is inactive. Please contact administrator.",
        });
      }

      req.institute = institute;
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

