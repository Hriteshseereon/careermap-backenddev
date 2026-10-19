import prisma from "../../config/db.js";
import { PermissionRepository } from "./permission.repository.js";

export const createPermission = async (body) => {
  try {
    const modules = Array.isArray(body?.modules) ? body.modules : [];
    const roleId = Number(body.roleId);

    if (!roleId) {
      return {
        success: false,
        message: "roleId is required",
      };
    }

    const permissions = modules.map((module) => ({
      roleId,
      module,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
    }));

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

    const permissions =
      await PermissionRepository.findAll();

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

    const permission =
      await PermissionRepository.findById(id);

    if (!permission) {
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

export const updatePermission = async (
  roleId,
  body
) => {
  try {
    const numericRoleId = Number(roleId);
    if (!numericRoleId) {
      return {
        success: false,
        message: "Valid roleId is required",
      };
    }

    const modules = Array.isArray(body?.modules)
      ? body.modules
      : (Array.isArray(body) ? body : []);

    await prisma.permission.deleteMany({
      where: {
        roleId: numericRoleId,
      },
    });

    if (modules.length > 0) {
      await prisma.permission.createMany({
        data: modules.map((module) => ({
          roleId: numericRoleId,
          module,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
        })),
        skipDuplicates: true,
      });
    }

    const permissions =
      await prisma.permission.findMany({
        where: {
          roleId: numericRoleId,
        },
      });

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

export const deletePermission = async (
  id
) => {
  try {

    await PermissionRepository.delete(id);

    return {
      success: true,
      message:
        "Permission deleted successfully",
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};