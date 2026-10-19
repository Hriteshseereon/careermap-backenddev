import { CareerNewsletterRepository } from "./careernewsletter.repository.js";
import { uploadToS3 } from "../../lib/s3Upload.js";

export const createCareerNewsletter = async (body, file) => {
  try {

    const existing = await CareerNewsletterRepository.findByTitle(body.title);

    if (existing) {
      return {
        success: false,
        message: "Career Newsletter already exists",
      };
    }

    let image;

    if (file) {
      image = await uploadToS3(file, "career-newsletter");
    }

    const newsletter =
      await CareerNewsletterRepository.create({

        title: body.title,

        description: body.description,

        url: body.url,

        image,
          type: body.type,
      });

    return {
      success: true,
      data: newsletter,
    };

  } catch (err) {

    return {
      success: false,
      message: err.message,
    };

  }
};

export const getCareerNewsletters = async () => {

  try {

    const data = await CareerNewsletterRepository.findAll();

    return {
      success: true,
      data,
    };

  } catch (err) {

    return {
      success: false,
      message: err.message,
    };

  }

};

export const getCareerNewsletterById = async (id) => {

  try {

    const data = await CareerNewsletterRepository.findById(Number(id));

    if (!data) {

      return {
        success: false,
        message: "Career Newsletter not found",
      };

    }

    return {
      success: true,
      data,
    };

  } catch (err) {

    return {
      success: false,
      message: err.message,
    };

  }

};

export const updateCareerNewsletter = async (id, body, file) => {

  try {

    const existing =
      await CareerNewsletterRepository.findById(Number(id));

    if (!existing) {

      return {
        success: false,
        message: "Career Newsletter not found",
      };

    }

    let image;

    if (file) {

      image = await uploadToS3(file, "career-newsletter");

    }

    const updated =
      await CareerNewsletterRepository.update(Number(id), {

        ...(body.title && {
          title: body.title,
        }),

        ...(body.description && {
          description: body.description,
        }),

        ...(body.url && {
          url: body.url,
        }),

        ...(image && {
          image,
        }),
        ...(body.type && {
  type: body.type,
}),
      });

    return {
      success: true,
      data: updated,
    };

  } catch (err) {

    return {
      success: false,
      message: err.message,
    };

  }

};

export const deleteCareerNewsletter = async (id) => {

  try {

    await CareerNewsletterRepository.delete(Number(id));

    return {

      success: true,

      message: "Career Newsletter deleted successfully",

    };

  } catch (err) {

    return {

      success: false,

      message: err.message,

    };

  }

};