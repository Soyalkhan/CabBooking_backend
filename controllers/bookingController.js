import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";

// 1. Create Booking
export const createBooking = async (req, res) => {
  const { cabName, pickupLocation, dropLocation, distanceInKm, perKmRate, totalFare, tax, discount, totalAmount, paymentType, extraNote, scheduledAt } = req.body;
  try {
    const booking = await Booking.create({
      user: req.user._id,
      cabName,
      pickupLocation,
      dropLocation,
      distanceInKm,
      perKmRate,
      totalFare,
      tax,
      discount,
      totalAmount,
      paymentType,
      extraNote,
      bookingStatus: "pending",
      scheduledAt
    });
    res.status(201).json({ msg: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 2. Get my bookings (For the logged-in user)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 3. Get all bookings (Admin panel with optional email filter)
export const getAllBookings = async (req, res) => {
  try {
    let filter = {};

    // If the query contains email, filter bookings by user email
    if (req.query.email) {
      const user = await User.findOne({ email: req.query.email });
      if (user) {
        filter.user = user._id;
      } else {
        return res.status(404).json({ msg: "User not found" });
      }
    }

    const bookings = await Booking.find(filter).populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 4. Update booking status (for Admin)
export const updateBookingStatus = async (req, res) => {
  const { bookingStatus } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { bookingStatus }, { new: true });
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.status(200).json({ msg: "Booking status updated", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 5. Delete a booking (Admin only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.status(200).json({ msg: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
