import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Cab from "../models/cabModel.js";
import User from "../models/userModel.js";
import Driver from "../models/driverModel.js";
import Review from "../models/reviewModel.js";
import Contact from "../models/contactModel.js";
import Discount from "../models/discountModel.js";
import PageView from "../models/pageViewModel.js";

const checkCollection = async (Model, name) => {
  const start = Date.now();
  try {
    await Model.countDocuments();
    return { name, status: "up", responseTime: `${Date.now() - start}ms` };
  } catch {
    return { name, status: "down", responseTime: `${Date.now() - start}ms` };
  }
};

export const getHealth = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? "up" : dbState === 2 ? "connecting" : "down";

    const services = await Promise.all([
      checkCollection(User, "Users API"),
      checkCollection(Booking, "Bookings API"),
      checkCollection(Cab, "Cabs API"),
      checkCollection(Driver, "Drivers API"),
      checkCollection(Review, "Reviews API"),
      checkCollection(Contact, "Contact API"),
      checkCollection(Discount, "Discounts API"),
      checkCollection(PageView, "Analytics API"),
    ]);

    services.unshift({ name: "MongoDB", status: dbStatus, responseTime: "-" });

    const mem = process.memoryUsage();
    const uptime = process.uptime();

    res.status(200).json({
      services,
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
      memoryUsage: `${Math.round(mem.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
