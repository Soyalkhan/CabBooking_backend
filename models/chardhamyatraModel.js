import mongoose from 'mongoose';

const chardhamSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    email:       { type: String, required: true },  // ← now required
    phone:       { type: String, required: true },
    alternateNumber: { type: String },
    travelers:   { type: Number,   required: true },
    pickupAddress:  { type: String, required: true },
    startDate:   { type: Date,     required: true },
    endDate:     { type: Date,     required: true },
    hasPasses:   { type: Boolean,  default: false },
    selectedCar: {
      name:     { type: String },
      capacity: { type: String },
      price:    { type: String }
    },
    message:     { type: String },
    createdAt:   { type: Date,     default: Date.now }
  });
  
export default mongoose.model("Enquiry", chardhamSchema);
