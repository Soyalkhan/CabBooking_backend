import express from "express";
import { submitInquiryCharDham } from "../controllers/chardhamyatraController.js";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { protect, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public - submit contact form
router.post("/", submitContact);

// Char Dham inquiry (existing)
router.post("/chardham", submitInquiryCharDham);

// Admin routes
router.get("/all", protect, isAdmin, getAllContacts);
router.patch("/:id/status", protect, isAdmin, updateContactStatus);
router.delete("/:id", protect, isAdmin, deleteContact);

export default router;
