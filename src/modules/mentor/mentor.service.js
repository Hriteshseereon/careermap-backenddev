import { uploadToS3 } from "../../lib/s3Upload.js";
import { MentorRepository } from "./mentor.repository.js";
import prisma from "../../config/db.js";

// 🔹 CREATE
export const createMentor = async (body, files) => {
  try {
    const existing = await MentorRepository.findByName(body.name);
    if (existing) {
      return {
        success: false,
        message: "Mentor with this name already exists",
      };
    }

    let imageUrl, resumeUrl;

    if (files?.image?.[0]) {
      imageUrl = await uploadToS3(files.image[0], "mentors");
    }

    if (files?.resume?.[0]) {
      resumeUrl = await uploadToS3(files.resume[0], "mentors");
    }

    // 🔥 PARSE AVAILABILITY
    let availabilityData = [];
    if (body.availability) {
      try {
        availabilityData = JSON.parse(body.availability);
      } catch {
        return { success: false, message: "Invalid availability format" };
      }
    }

    const mentor = await prisma.mentor.create({
      data: {
       categoryId: body.categoryId
  ? Number(body.categoryId)
  : null,

secondcategoryId:
  body.secondcategoryId
    ? Number(body.secondcategoryId)
    : null,

subCategoryId:
  body.subCategoryId
    ? Number(body.subCategoryId)
    : null,
        
        name: body.name,
        email: body.email,
        phone_number: body.phone_number,
        year:body.year,
        dateof_birth: body.dateof_birth
          ? new Date(body.dateof_birth)
          : null,

        designation: body.designation,
        education: body.education,
        placeof_word: body.placeof_word,
        linkedin: body.linkedin,
        facebook: body.facebook,
        skill: body.skill,

        experience: body.experience
          ? Number(body.experience)
          : null,

        mentor_fees: body.mentor_fees,
        rank: body.rank,
        description: body.description,

        status:
          body.status !== undefined
            ? body.status === "true" || body.status === true
            : undefined,

        ...(imageUrl && { image: imageUrl }),
        ...(resumeUrl && { resume: resumeUrl }),

        // 🔥 CREATE AVAILABILITY (NESTED)
        availability: {
          create: availabilityData.map((item) => ({
            date: new Date(item.date),
            timeSlots: item.timeSlots || [],
          })),
        },
      },
      include: {
        availability: true,
      },
    });

    return { success: true, data: mentor };

  } catch (error) {
    console.error("❌ createMentor Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 GET ALL
export const getMentors = async () => {
  try {

    const mentors =
      await MentorRepository.findAll();

   const data = mentors
  .map((mentor) => {
    const totalReviews = mentor.reviews.length;

    const averageRating =
      totalReviews > 0
        ? Number(
            (
              mentor.reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / totalReviews
            ).toFixed(1)
          )
        : 0;

    return {
      ...mentor,
      averageRating,
      totalReviews,
    };
  })
  .sort((a, b) => {
    // Higher rating first
    if (b.averageRating !== a.averageRating) {
      return b.averageRating - a.averageRating;
    }

    // If ratings are same, more reviews first
    if (b.totalReviews !== a.totalReviews) {
      return b.totalReviews - a.totalReviews;
    }

    // Latest mentor first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

return {
  success: true,
  data,
};

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔹 GET BY ID
export const getMentorById = async (id) => {
  try {

    const mentor =
      await MentorRepository.findById(
        Number(id)
      );

    if (!mentor) {
      return {
        success: false,
        message: "Mentor not found",
      };
    }

    const totalReviews =
      mentor.reviews.length;

    const averageRating =
      totalReviews > 0
        ? Number(
            (
              mentor.reviews.reduce(
                (sum, review) =>
                  sum + review.rating,
                0
              ) / totalReviews
            ).toFixed(1)
          )
        : 0;

    return {
      success: true,

      data: {
        ...mentor,

        averageRating,

        totalReviews,
      },
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔹 UPDATE
export const updateMentor = async (id, body, files) => {
  try {
    let imageUrl, resumeUrl;

    // 🔹 Upload files
    if (files?.image?.[0]) {
      imageUrl = await uploadToS3(files.image[0], "mentors");
    }

    if (files?.resume?.[0]) {
      resumeUrl = await uploadToS3(files.resume[0], "mentors");
    }

    // 🔹 Parse availability
    let availabilityData;
    if (body.availability) {
      try {
        availabilityData = JSON.parse(body.availability);
      } catch {
        return { success: false, message: "Invalid availability format" };
      }
    }

    // 🔥 MAIN UPDATE (WITH AVAILABILITY)
    const updated = await prisma.mentor.update({
      where: { id: Number(id) },
    data: {

  categoryId: body.categoryId
    ? Number(body.categoryId)
    : undefined,

  secondcategoryId: body.secondcategoryId
    ? Number(body.secondcategoryId)
    : undefined,

  subCategoryId: body.subCategoryId
    ? Number(body.subCategoryId)
    : undefined,

  name: body.name,

  email: body.email,

  phone_number: body.phone_number,

  year: body.year,

  dateof_birth: body.dateof_birth
    ? new Date(body.dateof_birth)
    : undefined,

  designation: body.designation,

  education: body.education,

  placeof_word: body.placeof_word,

  linkedin: body.linkedin,

  facebook: body.facebook,

  skill: body.skill,

  experience: body.experience
    ? Number(body.experience)
    : undefined,

  mentor_fees: body.mentor_fees,

  rank: body.rank,

  description: body.description,

  status:
    body.status !== undefined
      ? body.status === "true" ||
        body.status === true
      : undefined,

  ...(imageUrl && {
    image: imageUrl,
  }),

  ...(resumeUrl && {
    resume: resumeUrl,
  }),

  ...(availabilityData && {
    availability: {
      deleteMany: {},
      create: availabilityData.map(
        (item) => ({
          date: new Date(item.date),
          timeSlots:
            item.timeSlots || [],
        })
      ),
    },
  }),
},
      include: {
        availability: true, // 🔥 return updated slots
      },
    });

    return { success: true, data: updated };

  } catch (error) {
    console.error("❌ updateMentor Error:", error);
    return { success: false, message: error.message };
  }
};

// 🔹 DELETE
export const deleteMentor = async (id) => {
  try {
    // 🔥 example FK check (change model name if needed)
    const isLinked = await prisma.booking?.findFirst({
      where: { mentorId: Number(id) },
    });

    if (isLinked) {
      return {
        success: false,
        message: "Mentor is linked with another model",
      };
    }

    await MentorRepository.delete(Number(id));

    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("❌ deleteMentor Error:", error);
    return { success: false, message: error.message };
  }
};