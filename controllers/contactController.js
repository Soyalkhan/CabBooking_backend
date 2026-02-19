import Contact from "../models/contactModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Submit contact form
export const submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: "Name, email, and message are required" });
  }

  try {
    const contact = await Contact.create({ name, email, phone, subject, message });

    // Send notification email to admin
    try {
      await transporter.sendMail({
        from: `"BookMyCab Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form: ${subject || "General Inquiry"} - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject || "Not specified"}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${message}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send admin notification:", emailErr);
    }

    // Send acknowledgment to the customer
    try {
      await transporter.sendMail({
        from: `"BookMyCab" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "We received your message - BookMyCab",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
              <h1 style="color: #000; margin: 0;">BookMyCab</h1>
            </div>
            <div style="padding: 30px;">
              <h2>Thank you for contacting us!</h2>
              <p>Dear ${name},</p>
              <p>We have received your message and will get back to you within 24 hours.</p>
              <p>For urgent queries, please call us at <a href="tel:+918470006336">+91 84700 06336</a></p>
              <br/>
              <p>Best regards,<br/>BookMyCab Team</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send customer acknowledgment:", emailErr);
    }

    res.status(201).json({ msg: "Message sent successfully", contact });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all contacts (admin)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update contact status (admin)
export const updateContactStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    res.status(200).json({ msg: "Contact status updated", contact });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete contact (admin)
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    res.status(200).json({ msg: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
