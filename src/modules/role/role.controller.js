import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "./role.service.js";

export const createRoleController =
async (req, res) => {

  const result =
    await createRole(req.body);

  res
    .status(
      result.success ? 201 : 400
    )
    .json(result);
};

export const getRolesController =
async (req, res) => {

  const result =
    await getRoles();

  res.status(200).json(result);
};

export const getRoleByIdController =
async (req, res) => {

  const result =
    await getRoleById(
      req.params.id
    );

  res
    .status(
      result.success ? 200 : 404
    )
    .json(result);
};

export const updateRoleController =
async (req, res) => {

  const result =
    await updateRole(
      req.params.id,
      req.body
    );

  res
    .status(
      result.success ? 200 : 400
    )
    .json(result);
};

export const deleteRoleController =
async (req, res) => {

  const result =
    await deleteRole(
      req.params.id
    );

  res
    .status(
      result.success ? 200 : 400
    )
    .json(result);
};