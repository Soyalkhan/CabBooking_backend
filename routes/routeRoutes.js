// routes/routeRoutes.js
import express from "express";
import { calculateRoute } from "../controllers/routeController.js";

const router = express.Router();

// POST /api/route/calculate
router.post("/calculate", calculateRoute);

export default router;
