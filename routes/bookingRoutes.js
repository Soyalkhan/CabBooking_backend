import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  assignDriver,
  updatePaymentStatus,
  deleteBooking,
} from "../controllers/bookingController.js";
import { protect, isAdmin, optionalAuth } from "../middlewares/auth.js";

const router = express.Router();

// Create booking (supports both auth and guest users)
router.post("/", optionalAuth, createBooking);

// Get my bookings (protected, user only)
router.get("/my", protect, getMyBookings);

// Get all bookings (admin only, protected)
router.get("/all", protect, isAdmin, getAllBookings);

// Update booking status (admin only)
router.patch("/:id/status", protect, isAdmin, updateBookingStatus);

// Assign driver to booking (admin only)
router.patch("/:id/assign-driver", protect, isAdmin, assignDriver);

// Update payment status (admin only)
router.patch("/:id/payment-status", protect, isAdmin, updatePaymentStatus);

// Delete booking (admin only)
router.delete("/:id", protect, isAdmin, deleteBooking);

export default router;
