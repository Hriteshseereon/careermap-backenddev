import { Router } from "express";
import {
  createSendMessageController,
  getSendMessagesController,
  getSendMessageByIdController,
  getMyMessagesController,
  updateSendMessageStatusController,
  deleteSendMessageController,
} from "./sendmessage.controller.js";

import { optionalAuth } from "../../middlewares/optionalAuth.js";
import { protectAuth } from "../../middlewares/protectAuth.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";

const router = Router();

// ==========================================
// 📩 USER ROUTES
// ==========================================

// Create message (supports auth token or guest body, links to user if authenticated)
router.post("/", optionalAuth, createSendMessageController);
router.post("/send", optionalAuth, createSendMessageController);

// Logged-in user view their submitted messages
router.get("/my-messages", protectAuth, getMyMessagesController);

// ==========================================
// 🛡️ ADMIN / STAFF ROUTES
// ==========================================

// Admin: Get all sent messages (with user details: name, email, phone, message)
router.get("/", protectAdminOrStaff, getSendMessagesController);
router.get("/admin/all", protectAdminOrStaff, getSendMessagesController);

// Admin: Get single message by ID
router.get("/:id", protectAdminOrStaff, getSendMessageByIdController);

// Admin: Update message status (e.g. pending, read, replied, resolved)
router.put("/:id/status", protectAdminOrStaff, updateSendMessageStatusController);
router.patch("/:id/status", protectAdminOrStaff, updateSendMessageStatusController);

// Admin: Delete a message
router.delete("/:id", protectAdminOrStaff, deleteSendMessageController);

export default router;
