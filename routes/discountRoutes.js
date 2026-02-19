import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  updateDiscount,
  deleteDiscount,
  toggleDiscount,
  applyDiscount,
} from "../controllers/discountController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, isAdmin, createDiscount);
router.get("/all", protect, isAdmin, getAllDiscounts);
router.get("/active", getActiveDiscounts);
router.put("/:id", protect, isAdmin, updateDiscount);
router.delete("/:id", protect, isAdmin, deleteDiscount);
router.patch("/:id/toggle", protect, isAdmin, toggleDiscount);
router.post("/apply", applyDiscount);

export default router;
