import { uploadToS3 } from "../../lib/s3Upload.js";
import { StreamRepository } from "./stream.repository.js";

// 🔹 Create
export const createStream = async (body, file) => {
  try {

    const streamName = body.name?.trim();

    if (!streamName) {
      return {
        success: false,
        message: "Stream name is required",
      };
    }

    const existing =
      await StreamRepository.findByName(
        streamName
      );

    if (existing) {
      return {
        success: false,
        message: "Stream already exists",
      };
    }

    const imageUrl = file
      ? await uploadToS3(file, "streams")
      : null;

    const stream =
      await StreamRepository.create({
        name: streamName,
        image: imageUrl,
      });

    return {
      success: true,
      data: stream,
    };

  } catch (error) {
    console.error(
      "❌ createStream Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔹 Get All
export const getStreams = async () => {
  try {

    const data =
      await StreamRepository.findAll();

    return {
      success: true,
      data,
    };

  } catch (error) {

    console.error(
      "❌ getStreams Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔹 Update
export const updateStream = async (
  id,
  body,
  file
) => {

  try {

    const streamName =
      body.name?.trim();

    if (streamName) {

      const existing =
        await StreamRepository.findByName(
          streamName
        );

      if (
        existing &&
        existing.id !== Number(id)
      ) {
        return {
          success: false,
          message:
            "Stream already exists",
        };
      }
    }

    let imageUrl;

    if (file) {
      imageUrl =
        await uploadToS3(
          file,
          "streams"
        );
    }

    const updated =
      await StreamRepository.update(
        Number(id),
        {
          ...(streamName && {
            name: streamName,
          }),

          ...(imageUrl && {
            image: imageUrl,
          }),
        }
      );

    return {
      success: true,
      data: updated,
    };

  } catch (error) {

    console.error(
      "❌ updateStream Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔹 Delete
export const deleteStream = async (id) => {

  try {

    await StreamRepository.delete(
      Number(id)
    );

    return {
      success: true,
      message:
        "Deleted successfully",
    };

  } catch (error) {

    console.error(
      "❌ deleteStream Error:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};