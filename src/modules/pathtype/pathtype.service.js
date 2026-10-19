import { pathTypeRepository } from "./pathtype.repository.js";

export const createPathType = async (body) => {
  try {
    const data = await pathTypeRepository.create(body);
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getAllPathType = async () => {
  const data = await pathTypeRepository.findAll();
  return { success: true, data };
};

export const getPathTypeById = async (id) => {
  const data = await pathTypeRepository.findById(Number(id));
  return data ? { success: true, data } : { success: false };
};

export const updatePathType = async (id, body) => {
  try {
    const data = await pathTypeRepository.update(Number(id), body);
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const deletePathType = async (id) => {
  await pathTypeRepository.delete(Number(id));
  return { success: true };
};