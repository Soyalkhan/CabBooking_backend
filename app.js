import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import route modules
import authRoutes from "./routes/authRoutes.js";
import cabRoutes from "./routes/cabRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Enable JSON parsing for incoming requests
app.use(express.json());

// Enable CORS with explicit config
app.use(
  cors({
    origin: ["https://bookmycab.co", "https://www.bookmycab.co"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/cabs", cabRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/contact", contactRoutes);

// Export the app for server.js or Vercel
export default app;
