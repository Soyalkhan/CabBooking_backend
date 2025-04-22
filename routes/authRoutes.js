import express from "express";
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify", verifyOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);

export default router;
