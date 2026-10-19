import { Router } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { askChatbotController, getChatbotConfigController } from "./chatbot.controller.js";

const router = Router();

/**
 * Guests may use Career Bee without a token, but a token that is present and
 * invalid/expired gets a 401 so the apps' refresh-and-retry logic runs
 * (otherwise logged-in users would silently be downgraded to guests).
 */
const chatbotAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header) return next();
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded?.id || decoded.type === "temp") throw new Error("not a user token");
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

// IPv6 clients control a whole /64, so group them by prefix.
const clientKey = (ip = "") => {
  if (!ip.includes(":") || ip.startsWith("::ffff:")) return ip.replace(/^::ffff:/, "");
  const groups = ip.split("::")[0].split(":").slice(0, 4);
  return `${groups.join(":")}::/64`;
};

// Logged-in users are limited per account, guests per IP (AI calls cost money).
const limiterKey = (req) => (req.user?.id ? `user:${req.user.id}` : `ip:${clientKey(req.ip)}`);
const tooMany = { success: false, message: "You're asking very fast - please wait a moment and try again." };

const burstLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: (req) => (req.user?.id ? Number(process.env.CHATBOT_USER_PER_MINUTE || 10) : Number(process.env.CHATBOT_GUEST_PER_MINUTE || 5)),
  keyGenerator: limiterKey,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: tooMany,
});

const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: (req) => (req.user?.id ? Number(process.env.CHATBOT_USER_PER_DAY || 150) : Number(process.env.CHATBOT_GUEST_PER_DAY || 30)),
  keyGenerator: limiterKey,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "You've reached today's Career Bee limit. Please come back tomorrow." },
});

router.get("/config", getChatbotConfigController);
// Ceiling per network address for everyone (stops one machine from cycling
// through many accounts).
const ipLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.CHATBOT_IP_PER_MINUTE || 40),
  keyGenerator: (req) => `ipall:${clientKey(req.ip)}`,
  standardHeaders: false,
  legacyHeaders: false,
  message: tooMany,
});

router.post("/ask", chatbotAuth, ipLimiter, burstLimiter, dailyLimiter, askChatbotController);

export default router;
