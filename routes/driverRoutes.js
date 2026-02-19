import express from "express";
import {
  getAllDrivers,
  getActiveDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  toggleDriverStatus,
} from "../controllers/driverController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all", protect, isAdmin, getAllDrivers);
router.get("/active", protect, isAdmin, getActiveDrivers);
router.post("/", protect, isAdmin, addDriver);
router.put("/:id", protect, isAdmin, updateDriver);
router.delete("/:id", protect, isAdmin, deleteDriver);
router.patch("/:id/status", protect, isAdmin, toggleDriverStatus);

export default router;
