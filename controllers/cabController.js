import Cab from "../models/cabModel.js";

// Create a cab
export const addCab = async (req, res) => {
  try {
    const cab = await Cab.create(req.body);
    res.status(201).json({ msg: "Cab added", cab });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all cabs or by ID
export const getCabs = async (req, res) => {
  try {
    const cabs = req.params.id
      ? await Cab.findById(req.params.id)
      : await Cab.find();
    res.status(200).json(cabs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update cab details
export const updateCab = async (req, res) => {
  try {
    const cab = await Cab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cab) return res.status(404).json({ msg: "Cab not found" });
    res.status(200).json({ msg: "Cab updated", cab });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a cab
export const deleteCab = async (req, res) => {
  try {
    const cab = await Cab.findByIdAndDelete(req.params.id);
    if (!cab) return res.status(404).json({ msg: "Cab not found" });
    res.status(200).json({ msg: "Cab deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update perKmRate
export const updatePerKmRate = async (req, res) => {
  try {
    const { perKmRate } = req.body;
    const cab = await Cab.findByIdAndUpdate(req.params.id, { perKmRate }, { new: true });
    if (!cab) return res.status(404).json({ msg: "Cab not found" });
    res.status(200).json({ msg: "perKmRate updated", cab });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Toggle isActive
export const toggleCabStatus = async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (!cab) return res.status(404).json({ msg: "Cab not found" });

    cab.isActive = !cab.isActive;
    await cab.save();
    res.status(200).json({ msg: `Cab is now ${cab.isActive ? 'active' : 'inactive'}`, cab });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
