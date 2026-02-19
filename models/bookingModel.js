import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cabName: { type: String, required: true },
    bookingType: {
      type: String,
      enum: [
        "one-way",
        "round-trip",
        "multi-city",
        "local",
        "airport-pickup",
        "airport-drop",
      ],
      default: "one-way",
    },
    pickupLocation: { type: String, required: true },
    pickupPinLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    dropLocation: { type: String, required: true },
    distanceInKm: { type: Number, required: true },
    perKmRate: { type: Number, required: true },
    totalFare: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    tollCharges: { type: Number, default: 0 },
    tollOption: { type: String, enum: ["self", "included"], default: "self" },
    returnFare: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ["online", "to_driver"],
      default: "to_driver",
    },
    extraNote: { type: String },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    scheduledAt: { type: Date, required: true },
    // Guest booking fields
    passengerName: { type: String },
    passengerEmail: { type: String },
    passengerPhone: { type: String },
    passengerGender: { type: String, enum: ["Male", "Female", "Other", ""] },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    couponCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
