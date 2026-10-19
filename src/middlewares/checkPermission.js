import prisma from "../config/db.js";

export const checkPermission =
(module, action) =>
async (req, res, next) => {

  try {

    // Admin bypass
    if (req.admin) {
      return next();
    }

    if (!req.staff) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let roleId = req.staff.roleId;

    // Check DB for latest roleId and account status so changes take effect immediately
    if (req.staff.id) {
      const currentStaff = await prisma.staffUser.findUnique({
        where: { id: Number(req.staff.id) },
        select: { roleId: true, status: true },
      });
      if (currentStaff) {
        if (currentStaff.status === false) {
          return res.status(403).json({
            success: false,
            message: "Account is inactive. Please contact administrator.",
          });
        }
        roleId = currentStaff.roleId;
      }
    }

    const permission =
      await prisma.permission.findFirst({
        where: {
          roleId: Number(roleId),
          module,
        },
      });

    const actionField =
      `can${action.charAt(0).toUpperCase()}${action.slice(1)}`;

    if (
      !permission ||
      !permission[actionField]
    ) {
      return res.status(403).json({
        success: false,
        message: "Permission denied",
      });
    }

    next();

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};