import { uploadToS3 } from "../../lib/s3Upload.js";
import { SubCategoryRepository } from "./subcategory.repository.js";

// 🔹 CREATE
export const createSubCategory = async (body, files) => {
  try {
    let coverImageUrl, fileUrl;

    if (files?.coverImage?.[0]) {
      coverImageUrl = await uploadToS3(files.coverImage[0], "subcategory");
    }

    if (files?.file?.[0]) {
      fileUrl = await uploadToS3(files.file[0], "subcategory/files");
    }

    const data = await SubCategoryRepository.create({
      title: body.title,
      categoryId: Number(body.categoryId),
      secondcategoryId: Number(body.secondcategoryId),
      
      path: body.path,
      file: fileUrl,
      coverImage: coverImageUrl,
      description: body.description,
      specialization: body.specialization,
      importandt_facts: body.importandt_facts
        
    });

    return { success: true, data };

  } catch (error) {
    console.error("❌ createSubCategory Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 GET ALL
export const getSubCategories = async () => {
  try {
    const data = await SubCategoryRepository.findAll();
    return { success: true, data };
  } catch (error) {
    console.error("❌ getSubCategories Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 GET BY ID
export const getSubCategoryById = async (id) => {
  try {
    const data = await SubCategoryRepository.findById(Number(id));

    if (!data) {
      return { success: false, message: "SubCategory not found" };
    }

    return { success: true, data };

  } catch (error) {
    console.error("❌ getSubCategoryById Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 UPDATE
export const updateSubCategory = async (id, body, files) => {
  try {
    let coverImageUrl, fileUrl;

    if (files?.coverImage) {
      coverImageUrl = await uploadToS3(files.coverImage, "subcategory");
    }

    if (files?.file) {
      fileUrl = await uploadToS3(files.file, "subcategory/files");
    }

    const updated = await SubCategoryRepository.update(Number(id), {
      title: body.title,
      categoryId: Number(body.categoryId),
      secondcategoryId: Number(body.secondcategoryId),
     
      path: body.path,
      description: body.description,
      specialization: body.specialization,
      importandt_facts: body.importandt_facts,

      ...(coverImageUrl && { coverImage: coverImageUrl }),
      ...(fileUrl && { file: fileUrl }),
    });

    return { success: true, data: updated };

  } catch (error) {
    console.error("❌ updateSubCategory Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteSubCategory = async (id) => {
  try {
    await SubCategoryRepository.delete(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("❌ deleteSubCategory Error:", error);
    return { success: false, message: error.message };
  }
};
export const getSubBySecondCategory = async (secondcategoryId) => {
  try {

    const data =
      await SubCategoryRepository.findBySecondCategoryId(secondcategoryId);

    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
};