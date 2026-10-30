import { SendMessageRepository } from "./sendmessage.repository.js";
import prisma from "../../config/db.js";

export const createSendMessage = async (userId, body = {}) => {
  try {
    const rawMessage = body.message;
    if (!rawMessage || typeof rawMessage !== "string" || !rawMessage.trim()) {
      return {
        success: false,
        message: "Message is required",
      };
    }

    const resolvedUserId = userId
      ? Number(userId)
      : (body.userId || body.user_id ? Number(body.userId || body.user_id) : null);

    // If userId is provided, look up the user to autofill missing profile fields
    let userRecord = null;
    if (resolvedUserId && !isNaN(resolvedUserId)) {
      try {
        userRecord = await prisma.users.findUnique({
          where: { id: resolvedUserId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            mobile: true,
          },
        });
      } catch (err) {
        // Continue even if lookup fails
      }
    }

    const computedName =
      (body.name || body.fullName || "").trim() ||
      (userRecord
        ? `${userRecord.firstName || ""} ${userRecord.lastName || ""}`.trim() || userRecord.username
        : null);

    const computedEmail =
      (body.email_id || body.email || "").trim() ||
      (userRecord ? userRecord.email : null);

    const computedPhone =
      (body.phone_no || body.phone || body.mobile || "").trim() ||
      (userRecord ? userRecord.mobile : null);

    const data = await SendMessageRepository.create({
      userId: userRecord ? userRecord.id : (resolvedUserId && !isNaN(resolvedUserId) ? resolvedUserId : null),
      name: computedName || null,
      email_id: computedEmail || null,
      phone_no: computedPhone || null,
      message: rawMessage.trim(),
      status: body.status || "pending",
    });

    return {
      success: true,
      message: "Message sent successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSendMessages = async (query = {}) => {
  try {
    const data = await SendMessageRepository.findAll(query);

    return {
      success: true,
      count: data.length,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSendMessageById = async (id) => {
  try {
    const numId = Number(id);
    if (isNaN(numId)) {
      return {
        success: false,
        message: "Invalid ID parameter",
      };
    }

    const data = await SendMessageRepository.findById(numId);
    if (!data) {
      return {
        success: false,
        message: "Message not found",
      };
    }

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

export const getUserMessages = async (userId) => {
  try {
    const numId = Number(userId);
    if (isNaN(numId)) {
      return {
        success: false,
        message: "Invalid user ID",
      };
    }

    const data = await SendMessageRepository.findByUserId(numId);

    return {
      success: true,
      count: data.length,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateSendMessageStatus = async (id, body = {}) => {
  try {
    const numId = Number(id);
    if (isNaN(numId)) {
      return {
        success: false,
        message: "Invalid ID parameter",
      };
    }

    const existing = await SendMessageRepository.findById(numId);
    if (!existing) {
      return {
        success: false,
        message: "Message not found",
      };
    }

    const data = await SendMessageRepository.update(numId, {
      status: body.status || existing.status,
    });

    return {
      success: true,
      message: "Message status updated successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteSendMessage = async (id) => {
  try {
    const numId = Number(id);
    if (isNaN(numId)) {
      return {
        success: false,
        message: "Invalid ID parameter",
      };
    }

    const existing = await SendMessageRepository.findById(numId);
    if (!existing) {
      return {
        success: false,
        message: "Message not found",
      };
    }

    await SendMessageRepository.delete(numId);

    return {
      success: true,
      message: "Message deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
