import Driver from "../models/driverModel.js";

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getActiveDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ status: "active" }).sort({ name: 1 });
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ msg: "Driver added successfully", driver });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ msg: `A driver with this ${field} already exists` });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!driver) return res.status(404).json({ msg: "Driver not found" });
    res.status(200).json({ msg: "Driver updated", driver });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ msg: `A driver with this ${field} already exists` });
    }
    res.status(500).json({ msg: err.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) return res.status(404).json({ msg: "Driver not found" });
    res.status(200).json({ msg: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const toggleDriverStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!driver) return res.status(404).json({ msg: "Driver not found" });
    res.status(200).json({ msg: "Driver status updated", driver });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
