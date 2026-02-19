import express from "express";
import { logPageView, getVisitorStats } from "../controllers/pageViewController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/log", logPageView);
router.get("/stats", protect, isAdmin, getVisitorStats);

export default router;
