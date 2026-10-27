import prisma from "../../config/db.js";
import { PermissionRepository } from "./permission.repository.js";

export const createPermission = async (body) => {
  try {
    const roleId = Number(body?.roleId);

    if (!roleId) {
      return {
        success: false,
        message: "roleId is required",
      };
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return {
        success: false,
        message: `Role with ID ${roleId} not found`,
      };
    }

    const modules = Array.isArray(body?.modules) ? body.modules : [];

    const permissions = modules
      .map((item) => {
        const moduleName = typeof item === "string" ? item.trim() : item?.module?.trim();
        if (!moduleName) return null;
        return {
          roleId,
          module: moduleName,
          canView: typeof item === "object" && item?.canView !== undefined ? Boolean(item.canView) : true,
          canCreate: typeof item === "object" && item?.canCreate !== undefined ? Boolean(item.canCreate) : true,
          canEdit: typeof item === "object" && item?.canEdit !== undefined ? Boolean(item.canEdit) : true,
          canDelete: typeof item === "object" && item?.canDelete !== undefined ? Boolean(item.canDelete) : true,
        };
      })
      .filter(Boolean);

    if (permissions.length > 0) {
      await PermissionRepository.createMany(permissions);
    }

    return {
      success: true,
      message: "Permissions created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPermissions = async () => {
  try {
    const permissions = await PermissionRepository.findAll();

    return {
      success: true,
      data: permissions,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getPermissionById = async (id) => {
  try {
    const rawId = Number(id);
    if (!rawId) {
      return {
        success: false,
        message: "Valid ID is required",
      };
    }

    let permission = await PermissionRepository.findById(rawId);

    if (!permission) {
      const rolePermissions = await PermissionRepository.findByRoleId(rawId);
      if (rolePermissions && rolePermissions.length > 0) {
        return {
          success: true,
          data: rolePermissions,
        };
      }

      return {
        success: false,
        message: "Permission not found",
      };
    }

    return {
      success: true,
      data: permission,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updatePermission = async (idOrRoleId, body) => {
  try {
    const rawId = Number(idOrRoleId);

    // 1. Determine target roleId:
    // Check body.roleId first, or resolve from idOrRoleId (which could be a roleId OR a permission.id)
    let targetRoleId = Number(body?.roleId);

    if (!targetRoleId && rawId) {
      // Check if rawId is a valid Role ID
      const roleById = await prisma.role.findUnique({
        where: { id: rawId },
      });

      if (roleById) {
        targetRoleId = roleById.id;
      } else {
        // Check if rawId is a Permission ID
        const existingPermission = await prisma.permission.findUnique({
          where: { id: rawId },
        });

        if (existingPermission) {
          targetRoleId = existingPermission.roleId;
        }
      }
    }

    if (!targetRoleId) {
      return {
        success: false,
        message: "Valid roleId is required",
      };
    }

    // Verify role exists
    const role = await prisma.role.findUnique({
      where: { id: targetRoleId },
    });

    if (!role) {
      return {
        success: false,
        message: `Role with ID ${targetRoleId} does not exist`,
      };
    }

    const rawModules = Array.isArray(body?.modules)
      ? body.modules
      : (Array.isArray(body) ? body : []);

    const permissionData = rawModules
      .map((item) => {
        const moduleName = typeof item === "string" ? item.trim() : item?.module?.trim();
        if (!moduleName) return null;
        return {
          roleId: targetRoleId,
          module: moduleName,
          canView: typeof item === "object" && item?.canView !== undefined ? Boolean(item.canView) : true,
          canCreate: typeof item === "object" && item?.canCreate !== undefined ? Boolean(item.canCreate) : true,
          canEdit: typeof item === "object" && item?.canEdit !== undefined ? Boolean(item.canEdit) : true,
          canDelete: typeof item === "object" && item?.canDelete !== undefined ? Boolean(item.canDelete) : true,
        };
      })
      .filter(Boolean);

    // Delete existing permissions for this role
    await prisma.permission.deleteMany({
      where: {
        roleId: targetRoleId,
      },
    });

    // Create new permissions
    if (permissionData.length > 0) {
      await prisma.permission.createMany({
        data: permissionData,
        skipDuplicates: true,
      });
    }

    const permissions = await prisma.permission.findMany({
      where: {
        roleId: targetRoleId,
      },
    });

    return {
      success: true,
      message: "Permissions updated successfully",
      data: permissions,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deletePermission = async (id) => {
  try {
    const rawId = Number(id);
    if (!rawId) {
      return {
        success: false,
        message: "Valid ID is required",
      };
    }

    const perm = await prisma.permission.findUnique({
      where: { id: rawId },
    });

    if (perm) {
      await PermissionRepository.delete(rawId);
      return {
        success: true,
        message: "Permission deleted successfully",
      };
    }

    const count = await prisma.permission.count({
      where: { roleId: rawId },
    });

    if (count > 0) {
      await PermissionRepository.deleteByRoleId(rawId);
      return {
        success: true,
        message: "Role permissions deleted successfully",
      };
    }

    return {
      success: false,
      message: "Permission not found",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};