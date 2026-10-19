import prisma from "../../config/db.js";
import { PlansRepository } from "./plans.repository.js";

// 🔹 CREATE
export const createPlan = async (body) => {
  try {
    // ✅ unique name check
    const existing = await PlansRepository.findByName(body.name);

    if (existing) {
      return {
        success: false,
        message: "Plan with this name already exists",
      };
    }

    // ✅ validate moduleIds (if provided)
    if (body.moduleIds && body.moduleIds.length > 0) {
      const modules = await prisma.module.findMany({
        where: {
          id: {
            in: body.moduleIds.map(Number),
          },
        },
      });

      if (modules.length !== body.moduleIds.length) {
        return {
          success: false,
          message: "Some modules not found",
        };
      }
    }

    const data = await PlansRepository.create({
  name: body.name,
  features: body.features,
  description: body.description,

  validity: body.validity
    ? Number(body.validity)
    : null,

  price: Number(body.price),

  plan_type: body.plan_type,

  modules: body.moduleIds
    ? {
        connect: body.moduleIds.map((id) => ({
          id: Number(id),
        })),
      }
    : undefined,
});
    return { success: true, data };
  } catch (error) {
    console.error("❌ createPlan Error:", error);
    return { success: false, message: error.message };
  }
};
// get all api 
// 🔹 GET ALL
export const getPlans = async () => {
  try {
    const data = await PlansRepository.findAll();
    return { success: true, data };
  } catch (error) {
    console.error("❌ getPlans Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getPlanById = async (id) => {
  try {
    const data = await PlansRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "Plan not found" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("❌ getPlanById Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updatePlan = async (id, body) => {
  try {
    // ✅ validate moduleIds
    if (body.moduleIds && body.moduleIds.length > 0) {
      const modules = await prisma.module.findMany({
        where: {
          id: {
            in: body.moduleIds.map(Number),
          },
        },
      });

      if (modules.length !== body.moduleIds.length) {
        return {
          success: false,
          message: "Some modules not found",
        };
      }
    }

    const updated = await PlansRepository.update(Number(id), {
      name: body.name,
      features: body.features,
      description: body.description,
     validity: body.validity
    ? Number(body.validity)
    : null,
       price: Number(body.price),
      plan_type: body.plan_type,
      // 🔥 replace modules
      modules: body.moduleIds
        ? {
            set: body.moduleIds.map((id) => ({
              id: Number(id),
            })),
          }
        : undefined,
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("❌ updatePlan Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deletePlan = async (id) => {
  try {
    await PlansRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("❌ deletePlan Error:", error);
    return { success: false, message: error.message };
  }
};