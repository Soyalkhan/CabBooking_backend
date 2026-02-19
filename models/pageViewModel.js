import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
  {
    page: { type: String, required: true },
    sessionId: { type: String },
    userAgent: { type: String },
    referrer: { type: String },
  },
  { timestamps: true }
);

pageViewSchema.index({ createdAt: 1 });
pageViewSchema.index({ sessionId: 1 });

export default mongoose.model("PageView", pageViewSchema);
