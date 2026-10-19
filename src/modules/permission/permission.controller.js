import {
  createPermission,
  getPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} from "./permission.service.js";

export const createPermissionController =
async (req, res) => {

  const result =
    await createPermission(req.body);

  res
    .status(
      result.success ? 201 : 400
    )
    .json(result);
};

export const getPermissionsController =
async (req, res) => {

  const result =
    await getPermissions();

  res.status(200).json(result);
};

export const getPermissionByIdController =
async (req, res) => {

  const result =
    await getPermissionById(
      req.params.id
    );

  res
    .status(
      result.success ? 200 : 404
    )
    .json(result);
};

export const updatePermissionController =
async (req, res) => {

  const result =
    await updatePermission(
      req.params.id,
      req.body
    );

  res
    .status(
      result.success ? 200 : 400
    )
    .json(result);
};

export const deletePermissionController =
async (req, res) => {

  const result =
    await deletePermission(
      req.params.id
    );

  res
    .status(
      result.success ? 200 : 400
    )
    .json(result);
};