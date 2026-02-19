import Discount from "../models/discountModel.js";

export const createDiscount = async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.status(201).json({ msg: "Discount created", discount });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "A discount with this code already exists" });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json(discounts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getActiveDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({
      isActive: true,
      validTill: { $gte: new Date() },
    }).sort({ createdAt: -1 });
    res.status(200).json(discounts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!discount) return res.status(404).json({ msg: "Discount not found" });
    res.status(200).json({ msg: "Discount updated", discount });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "A discount with this code already exists" });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ msg: "Discount not found" });
    res.status(200).json({ msg: "Discount deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const toggleDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ msg: "Discount not found" });
    discount.isActive = !discount.isActive;
    await discount.save();
    res.status(200).json({ msg: `Discount ${discount.isActive ? "activated" : "deactivated"}`, discount });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const applyDiscount = async (req, res) => {
  const { code, amount } = req.body;
  try {
    const discount = await Discount.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validTill: { $gte: new Date() },
    });

    if (!discount) {
      return res.status(400).json({ msg: "Invalid or expired coupon code" });
    }

    if (amount < discount.minAmount) {
      return res.status(400).json({ msg: `Minimum booking amount is ₹${discount.minAmount}` });
    }

    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = Math.round((amount * discount.value) / 100);
      if (discount.maxDiscount > 0 && discountAmount > discount.maxDiscount) {
        discountAmount = discount.maxDiscount;
      }
    } else {
      discountAmount = discount.value;
    }

    discount.usageCount += 1;
    await discount.save();

    res.status(200).json({
      msg: "Coupon applied successfully",
      discountAmount,
      code: discount.code,
      description: discount.description,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
