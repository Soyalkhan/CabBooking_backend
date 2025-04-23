import mongoose from "mongoose";

const cabSchema = new mongoose.Schema({
  cabName: { type: String, required: true },
  cabType: { type: String, enum: ["Sedan", "SUV", "MPV", "Hatchback"], required: true },
  rating: { type: Number, default: 0 },
  seats: { type: Number, required: true },
  ac: { type: Boolean, default: true },
  bags: { type: Number, default: 0 },
  fuelType: [{ type: String, enum: ["Petrol", "Diesel", "CNG", "Electric"] }],
  perKmRate: { type: Number, required: true }, // dynamic pricing
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  onRide: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Cab", cabSchema);
