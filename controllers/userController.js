import User from "../models/userModel.js";

// Get current user's profile
export const getProfile = async (req, res) => {
  res.status(200).json(req.user); // req.user is attached via protect middleware
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields.password; // prevent password update here

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
