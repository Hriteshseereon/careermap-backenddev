import { Router } from "express";
import { createOrderController,verifyPaymentController } from "../controller/payment.controller.js";
import { protectAuth } from "../../../middlewares/protectAuth.js";

const router = Router();

router.post("/create-order", protectAuth, createOrderController);
router.post("/verify-payment", protectAuth, verifyPaymentController);

export default router;