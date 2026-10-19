import prisma from "../../config/db.js";
import { RoleRepository } from "./role.repository.js";

export const createRole = async (body) => {
  try {
    const existing =
      await RoleRepository.findByName(
        body.name
      );

    if (existing) {
      return {
        success: false,
        message: "Role already exists",
      };
    }

    const role =
      await RoleRepository.create({
        name: body.name,
        description: body.description,
      });

    // If modules were also provided in creation:
    if (Array.isArray(body.modules) && body.modules.length > 0) {
      await prisma.permission.createMany({
        data: body.modules.map((module) => ({
          roleId: role.id,
          module,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
        })),
        skipDuplicates: true,
      });
    }

    const fullRole = await RoleRepository.findById(role.id);

    return {
      success: true,
      data: fullRole || role,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRoles = async () => {
  try {

    const roles =
      await RoleRepository.findAll();

    return {
      success: true,
      data: roles,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getRoleById = async (id) => {
  try {

    const role =
      await RoleRepository.findById(id);

    if (!role) {
      return {
        success: false,
        message: "Role not found",
      };
    }

    return {
      success: true,
      data: role,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateRole = async (
  id,
  body
) => {
  try {
    const roleId = Number(id);
    const existing = await RoleRepository.findById(roleId);
    if (!existing) {
      return {
        success: false,
        message: "Role not found",
      };
    }

    if (body.name && body.name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await RoleRepository.findByName(body.name);
      if (duplicate && duplicate.id !== roleId) {
        return {
          success: false,
          message: "Role with this name already exists",
        };
      }
    }

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;

    await RoleRepository.update(roleId, updateData);

    // If modules are provided, sync permissions too!
    if (Array.isArray(body.modules)) {
      await prisma.permission.deleteMany({
        where: { roleId },
      });

      if (body.modules.length > 0) {
        await prisma.permission.createMany({
          data: body.modules.map((module) => ({
            roleId,
            module,
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
          })),
          skipDuplicates: true,
        });
      }
    }

    const fullRole = await RoleRepository.findById(roleId);

    return {
      success: true,
      data: fullRole,
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteRole = async (id) => {
  try {

    await RoleRepository.delete(id);

    return {
      success: true,
      message:
        "Role deleted successfully",
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};