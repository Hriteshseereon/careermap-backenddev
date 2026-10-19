import { uploadToS3 } from "../../lib/s3Upload.js";
import { SecondCategoryRepository } from "./secondcategory.repository.js";

export const createSecondCategory = async (body, files) => {
  try {
    let imageUrl, coverImageUrl;

    if (files?.image?.[0]) {
  imageUrl = await uploadToS3(files.image[0], "secondcategory");
}

if (files?.coverImage?.[0]) {
  coverImageUrl = await uploadToS3(files.coverImage[0], "secondcategory");
}

    const data = await SecondCategoryRepository.create({
      name: body.name,
      categoryId: Number(body.categoryId),

      path: body.path,
      image: imageUrl,
      coverImage: coverImageUrl,
      description: body.description,
      specialization: body.specialization,
      importandt_facts: body.importandt_facts,
    });

    return { success: true, data };

  } catch (error) {
    console.error("❌ createSecondCategory Error:", error);
    return { success: false, message: error.message };
  }
};

export const getSecondCategories = async () => {
  try {
    const data = await SecondCategoryRepository.findAll();
    return { success: true, data };
  } catch (error) {
    console.error("❌ getSecondCategories Error:", error);
    return { success: false, message: error.message };
  }
};

export const getSecondCategoryById = async (id) => {
  try {
    const data = await SecondCategoryRepository.findById(Number(id));
    if (!data) return { success: false, message: "Not found" };
    return { success: true, data };
  } catch (error) {
    console.error("❌ getSecondCategoryById Error:", error);
    return { success: false, message: error.message };
  }
};

export const updateSecondCategory = async (id, body, files) => {
  try {
    let imageUrl, coverImageUrl;

   if (files?.image?.[0]) {
  imageUrl = await uploadToS3(files.image[0], "secondcategory");
}

if (files?.coverImage?.[0]) {
  coverImageUrl = await uploadToS3(files.coverImage[0], "secondcategory");
}

    const updated = await SecondCategoryRepository.update(Number(id), {
      name: body.name,
      path: body.path,
      description: body.description,
      specialization: body.specialization,
      importandt_facts: body.importandt_facts,

      ...(imageUrl && { image: imageUrl }),
      ...(coverImageUrl && { coverImage: coverImageUrl }),
    });

    return { success: true, data: updated };

  } catch (error) {
    console.error("❌ updateSecondCategory Error:", error);
    return { success: false, message: error.message };
  }
};

export const deleteSecondCategory = async (id) => {
  try {
    await SecondCategoryRepository.delete(Number(id));
    return { success: true, message: "Deleted" };
  } catch (error) {
    console.error("❌ deleteSecondCategory Error:", error);
    return { success: false, message: error.message };
  }
};

export const getSecondByCategory = async (categoryId) => {
  try {

    const data =
      await SecondCategoryRepository.findByCategoryId(categoryId);

    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
};