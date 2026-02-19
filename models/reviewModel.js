import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerLocation: { type: String },
    customerImage: { type: String },
    driverName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "published", "hidden"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
