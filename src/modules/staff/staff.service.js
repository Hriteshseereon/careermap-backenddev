import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";
import { StaffRepository } from "./staff.repository.js";

const sanitizeStaff = (staff) => {
  if (!staff) return staff;
  const staffObj = { ...staff };
  delete staffObj.password;
  return staffObj;
};

export const createStaff = async (body) => {
  const existing = await StaffRepository.findByEmail(body.email);

  if (existing) {
    throw new Error("Email already exists");
  }

  const roleId = Number(body.roleId);
  if (!roleId) {
    throw new Error("Valid roleId is required");
  }

  const role = await prisma.role.findUnique({
    where: { id: roleId },
  });
  if (!role) {
    throw new Error("Selected role does not exist");
  }

  const password = await bcrypt.hash(body.password, 12);

  const user = await StaffRepository.create({
    name: body.name,
    email: body.email,
    password,
    roleId,
    status: body.status !== undefined ? Boolean(body.status) : true,
  });

  return sanitizeStaff(user);
};

export const loginStaff = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const staff = await StaffRepository.findByEmailWithPassword(email);

  if (!staff) {
    throw new Error("Staff not found");
  }

  if (staff.status === false) {
    throw new Error("Your account is deactivated. Please contact administrator.");
  }

  const isMatch = await bcrypt.compare(String(password), staff.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: staff.id,
      roleId: staff.roleId,
      name: staff.name,
      email: staff.email,
      roleName: staff.role?.name || null,
      type: "staff",
    },
    process.env.STAFF_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    staff: sanitizeStaff(staff),
  };
};

export const updateStaff = async (id, body) => {
  const staffId = Number(id);
  if (!staffId) {
    throw new Error("Valid staff ID is required");
  }

  const existing = await StaffRepository.findById(staffId);
  if (!existing) {
    throw new Error("Staff member not found");
  }

  const updateData = {};

  if (body.name !== undefined && body.name !== null) {
    updateData.name = body.name.trim();
  }

  if (body.email !== undefined && body.email !== null) {
    const trimmedEmail = body.email.trim();
    if (trimmedEmail.toLowerCase() !== existing.email.toLowerCase()) {
      const emailTaken = await StaffRepository.findByEmail(trimmedEmail);
      if (emailTaken && emailTaken.id !== staffId) {
        throw new Error("Email is already used by another staff member");
      }
      updateData.email = trimmedEmail;
    }
  }

  if (body.roleId !== undefined && body.roleId !== null) {
    const newRoleId = Number(body.roleId);
    if (!newRoleId) {
      throw new Error("Invalid roleId provided");
    }

    const targetRole = await prisma.role.findUnique({
      where: { id: newRoleId },
    });
    if (!targetRole) {
      throw new Error(`Role with ID ${newRoleId} does not exist`);
    }

    updateData.roleId = newRoleId;
  }

  if (body.status !== undefined && body.status !== null) {
    updateData.status = Boolean(body.status);
  }

  if (body.password && typeof body.password === "string" && body.password.trim().length > 0) {
    updateData.password = await bcrypt.hash(body.password.trim(), 12);
  }

  const updatedStaff = await StaffRepository.update(staffId, updateData);
  return sanitizeStaff(updatedStaff);
};

export const getAllStaff = async () => {
  const staffList = await StaffRepository.findAll();
  return staffList.map(sanitizeStaff);
};

export const getStaffById = async (id) => {
  const staff = await StaffRepository.findById(id);
  return sanitizeStaff(staff);
};

export const deleteStaff = async (id) => {
  return StaffRepository.delete(id);
};