import { Router } from "express";
import {sendOTP, verifyOTP,loginWithPassword,refreshToken,logout} from "./auth.controller.js";
const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp',verifyOTP);
router.post('/login/password', loginWithPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
export default router;
