import express from "express";
import {
  submitReview,
  getAllReviews,
  getPublishedReviews,
  updateReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", submitReview);
router.get("/published", getPublishedReviews);
router.get("/all", protect, isAdmin, getAllReviews);
router.patch("/:id/status", protect, isAdmin, updateReviewStatus);
router.delete("/:id", protect, isAdmin, deleteReview);

export default router;
