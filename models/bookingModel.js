import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cabName: { type: String, required: true },
  bookingType: {
    type: String,
    enum: [
      "one-way", "round-trip", "multi-city",
      "local", "airport-pickup", "airport-drop"
    ],
    default: "one-way"
  },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  distanceInKm: { type: Number, required: true },
  perKmRate: { type: Number, required: true },
  totalFare: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentType: {
    type: String,
    enum: ["online", "to_driver"],
    required: true
  },
  extraNote: { type: String },
  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "ongoing", "completed"],
    default: "pending"
  },
  scheduledAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
