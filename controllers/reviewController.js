import Review from "../models/reviewModel.js";

export const submitReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ msg: "Review submitted successfully", review });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getPublishedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "published" }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateReviewStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ msg: "Review not found" });
    res.status(200).json({ msg: "Review status updated", review });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found" });
    res.status(200).json({ msg: "Review deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
