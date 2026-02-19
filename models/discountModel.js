import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true },
    minAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    validTill: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Discount", discountSchema);
