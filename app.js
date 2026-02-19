import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cabRoutes from "./routes/cabRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import pageViewRoutes from "./routes/pageViewRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
dotenv.config();

const app = express();

const allowedOrigins = [
  "https://bookmycab.co",
  "https://www.bookmycab.co",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/cabs", cabRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/analytics", pageViewRoutes);
app.use("/api/health", healthRoutes);

export default app;