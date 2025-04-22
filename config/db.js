import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    console.log("Mongo URI:", process.env.MONGO_URI); // debug

    process.exit(1);
  }
};

export default connectDB;
