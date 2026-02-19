import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    licenseNumber: { type: String, required: true, unique: true },
    vehicleNumber: { type: String, required: true },
    vehicleName: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    totalTrips: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "on-trip", "inactive"],
      default: "active",
    },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
