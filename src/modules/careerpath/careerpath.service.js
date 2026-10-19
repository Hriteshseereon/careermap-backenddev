import { careerPathRepository } from "./careerpath.repository.js";

export const createCareerPath = async (body) => {
  try {
    // 🔍 Check first
    const existing = await careerPathRepository.findByPathName(body.pathName);

    if (existing) {
      return {
        success: false,
        message: "Path name already exists"
      };
    }

    // ✅ Then create
    const data = await careerPathRepository.create(body);

    return { success: true, data };

  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getAllCareerPath = async ()=>{
  return {success:true,data:await careerPathRepository.findAll()};
};

export const getCareerPathById = async (id)=>{
  const data = await careerPathRepository.findById(Number(id));
  return data ? {success:true,data}:{success:false};
};

export const updateCareerPath = async (id, body) => {
  try {
    const data = await careerPathRepository.update(Number(id), body);
    return { success: true, data };
  } catch (err) {
    if (err.code === "P2002") {
      return {
        success: false,
        message: "Path name already exists."
      };
    }
    return { success: false, message: err.message };
  }
};

export const deleteCareerPath = async (id)=>{
  await careerPathRepository.delete(Number(id));
  return {success:true};
};