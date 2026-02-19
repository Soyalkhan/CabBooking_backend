import express from "express";
import { getHealth } from "../controllers/healthController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, isAdmin, getHealth);

export default router;
