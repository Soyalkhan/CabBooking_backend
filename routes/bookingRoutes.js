import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from "../controllers/bookingController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Create booking (protected)
router.post("/", protect, createBooking);

// Get my bookings (protected, user only)
router.get("/my", protect, getMyBookings);

// Get all bookings (admin only, protected)
router.get("/all", protect, isAdmin, getAllBookings);

// Update booking status (admin only)
router.patch("/:id/status", protect, isAdmin, updateBookingStatus);

// Delete booking (admin only)
router.delete("/:id", protect, isAdmin, deleteBooking);

export default router;
