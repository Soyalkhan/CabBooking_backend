import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import Driver from "../models/driverModel.js";
import sendBookingConfirmationEmail from "../utils/bookingMailer.js";
import sendDriverAssignmentEmail from "../utils/driverAssignmentMailer.js";

// 1. Create Booking (supports both authenticated and guest users)
export const createBooking = async (req, res) => {
  const {
    cabName,
    bookingType,
    pickupLocation,
    pickupPinLocation,
    dropLocation,
    distanceInKm,
    perKmRate,
    totalFare,
    tax,
    tollCharges,
    tollOption,
    returnFare,
    discount,
    totalAmount,
    paymentType,
    extraNote,
    scheduledAt,
    passengerName,
    passengerEmail,
    passengerPhone,
    passengerGender,
  } = req.body;

  try {
    const bookingData = {
      cabName,
      bookingType: bookingType || "one-way",
      pickupLocation,
      pickupPinLocation: pickupPinLocation || undefined,
      dropLocation,
      distanceInKm,
      perKmRate,
      totalFare,
      tax,
      tollCharges: tollCharges || 0,
      tollOption: tollOption || "self",
      returnFare: returnFare || 0,
      discount,
      totalAmount,
      paymentType: paymentType || "to_driver",
      extraNote,
      bookingStatus: "pending",
      scheduledAt,
      passengerName,
      passengerEmail,
      passengerPhone,
      passengerGender,
    };

    // If user is authenticated, link booking to user
    if (req.user) {
      bookingData.user = req.user._id;
    }

    const booking = await Booking.create(bookingData);

    // Send confirmation email
    const emailTo = passengerEmail || (req.user && req.user.email);
    if (emailTo) {
      try {
        await sendBookingConfirmationEmail(emailTo, {
          bookingId: booking._id,
          passengerName: passengerName || (req.user && req.user.name),
          cabName,
          pickupLocation,
          dropLocation,
          scheduledAt,
          totalAmount,
          paymentType: paymentType || "to_driver",
        });
      } catch (emailErr) {
        console.error("Failed to send booking confirmation email:", emailErr);
      }
    }

    res.status(201).json({ msg: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 2. Get my bookings (For the logged-in user)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 3. Get all bookings (Admin panel with optional email filter)
export const getAllBookings = async (req, res) => {
  try {
    let filter = {};

    if (req.query.email) {
      const user = await User.findOne({ email: req.query.email });
      if (user) {
        filter.user = user._id;
      } else {
        // Also search by passengerEmail for guest bookings
        filter.passengerEmail = req.query.email;
      }
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate("assignedDriver", "name phone vehicleName vehicleNumber")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 4. Update booking status (for Admin)
export const updateBookingStatus = async (req, res) => {
  const { bookingStatus } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    );
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.status(200).json({ msg: "Booking status updated", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 5. Assign driver to booking (Admin only)
export const assignDriver = async (req, res) => {
  const { driverId } = req.body;
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ msg: "Driver not found" });

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedDriver: driverId, bookingStatus: "confirmed" },
      { new: true }
    ).populate("assignedDriver", "name phone vehicleName vehicleNumber");

    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    // Send email to customer
    const emailTo = booking.passengerEmail || (booking.user && (await User.findById(booking.user))?.email);
    if (emailTo) {
      try {
        await sendDriverAssignmentEmail(emailTo, {
          passengerName: booking.passengerName,
          cabName: booking.cabName,
          pickupLocation: booking.pickupLocation,
          dropLocation: booking.dropLocation,
          scheduledAt: booking.scheduledAt,
          totalAmount: booking.totalAmount,
          driverName: driver.name,
          driverPhone: driver.phone,
          vehicleName: driver.vehicleName,
          vehicleNumber: driver.vehicleNumber,
        });
      } catch (emailErr) {
        console.error("Failed to send driver assignment email:", emailErr);
      }
    }

    res.status(200).json({ msg: "Driver assigned and customer notified", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 6. Update payment status (Admin only)
export const updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.status(200).json({ msg: "Payment status updated", booking });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 7. Delete a booking (Admin only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.status(200).json({ msg: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
