import { uploadToS3 } from "../../lib/s3Upload.js";
import { CategoryRepository } from "./category.repository.js";
import {getCategoryPreviewFlags} from "../moduleAccess/moduleAccess.service.js";
// 🔹 CREATE
export const createCategory = async (body, files) => {
  try {
     const existingCategory = await CategoryRepository.findByTitle(
      body.title.trim()
    );

    if (existingCategory) {
      return {
        success: false,
        message: "Category title already exists.",
      };
    }
    let coverImageUrl;
    let fileUrl;

    if (files?.coverImage) {
      coverImageUrl = await uploadToS3(files.coverImage, "categories");
    }

    if (files?.file) {
      fileUrl = await uploadToS3(files.file, "categories/files");
    }

    const category = await CategoryRepository.create({
      title: body.title,
      streamId: Number(body.streamId),
    
      path: body.path,
      file: fileUrl, // ✅ uploaded file
      coverImage: coverImageUrl, // ✅ uploaded image
      description: body.description,
      specialization: body.specialization,
      importandt_facts: body.importandt_facts
        ? JSON.parse(body.importandt_facts)
        : [],
      category_access:
        body.category_access === "true" || body.category_access === true,
    });

    return { success: true, data: category };

  } catch (error) {
    console.error("❌ createCategory Error:", error);
    return { success: false, message: error.message };
  }
};
// 🔹 GET ALL
export const getCategories = async () => {
  try {
    const data = await CategoryRepository.findAll();
    return { success: true, data };
  } catch (error) {
    console.error("❌ getCategories Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getCategoryById = async (id) => {
  try {
    const data = await CategoryRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "Category not found" };
    }

    return { success: true, data };

  } catch (error) {
    console.error("❌ getCategoryById Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updateCategory = async (id, body, files) => {
  try {
    let coverImageUrl;
    let fileUrl;

    if (files?.coverImage) {
      coverImageUrl = await uploadToS3(files.coverImage, "categories");
    }

    if (files?.file) {
      fileUrl = await uploadToS3(files.file, "categories/files");
    }

    const updated = await CategoryRepository.update(Number(id), {
      title: body.title,
      streamId: Number(body.streamId),
    
      path: body.path,
      description: body.description,
      specialization: body.specialization,
      importandt_facts: body.importandt_facts
        ? JSON.parse(body.importandt_facts)
        : undefined,
      category_access:
        body.category_access !== undefined
          ? body.category_access === "true" || body.category_access === true
          : undefined,

      ...(coverImageUrl && { coverImage: coverImageUrl }),
      ...(fileUrl && { file: fileUrl }),
    });

    return { success: true, data: updated };

  } catch (error) {
    console.error("❌ updateCategory Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteCategory = async (id) => {
  try {
    await CategoryRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("❌ deleteCategory Error:", error);
    return { success: false, message: error.message };
  }
};

export const getCategoriesByStreamId = async (
  userId,
  streamId,
  moduleId
) => {
  try {

    let data =
      await CategoryRepository.getByStreamId(
        streamId
      );

     if (userId && moduleId) {
      data = await getCategoryPreviewFlags(
        userId,
        moduleId,
        data
      );
    }
    return {
      success: true,
      data,
    };

  } catch (error) {

    console.error(
      "❌ getCategoriesByStreamId Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateCategoryPreviewAccess = async (
  id,
  category_access
) => {
  try {
    const updated =
      await CategoryRepository.updatePreviewAccess(
        id,
        category_access
      );

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.error(
      "❌ updateCategoryPreviewAccess Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};