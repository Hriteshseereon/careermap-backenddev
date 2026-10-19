import prisma from "../../config/db.js";
import { askCareerBee, getChatbotConfig } from "./chatbot.service.js";

export const getChatbotConfigController = (req, res) => {
  res.json({ success: true, data: getChatbotConfig() });
};

export const askChatbotController = async (req, res) => {
  try {
    let userId = req.user?.id ? Number(req.user.id) : null;

    // A banned account keeps a valid token for a while - treat it as a guest.
    if (userId) {
      const user = await prisma.users.findUnique({ where: { id: userId }, select: { status: true } });
      if (!user || user.status === "banned") userId = null;
    }

    const platform = String(req.body?.platform || req.headers["x-client-platform"] || "web").toLowerCase();
    const result = await askCareerBee({ body: req.body, userId, platform });

    res.json({ success: true, data: result });
  } catch (error) {
    const status = error.status && error.status < 500 ? error.status : 500;
    if (status === 500) console.error("[chatbot] ask failed:", error.message);
    res.status(status).json({
      success: false,
      message: status === 500 ? "Career Bee is unavailable right now. Please try again." : error.message,
    });
  }
};
