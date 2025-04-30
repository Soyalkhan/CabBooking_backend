import express from "express";
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
  getUserDetails
} from "../controllers/authController.js";
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);
router.get('/me', protect, getUserDetails); 

export default router;
