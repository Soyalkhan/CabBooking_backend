import ChardhamyartaModel from '../models/chardhamyatraModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export  const submitInquiryCharDham = async (req, res) => {
  try {
    const {
      name,
      email,                // ← pull user’s email
      phone,
      alternateNumber,
      travelers,
      pickupAddress,
      startDate,
      endDate,
      hasPasses,
      selectedCar,
      car_capacity,
      car_price,
      message
    } = req.body;

    // Basic required-field check
    if (!name || !email || !phone || !travelers || !pickupAddress || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Save to DB
    const newInquiry = new ChardhamyartaModel({
      name,
      email,               // ← save it
      phone,
      alternateNumber,
      travelers,
      pickupAddress,
      startDate,
      endDate,
      hasPasses,
      selectedCar: { name: selectedCar, capacity: car_capacity, price: car_price },
      message
    });
    await newInquiry.save();
    console.log('Received email from frontend:', email);
    // ——————————————
    // 1️⃣ Email you (admin)
    // ——————————————
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Char Dham Inquiry - ${name}`,
      html: `
        <h3>Booking Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Alternate Number:</strong> ${alternateNumber}</p>
        <p><strong>Travelers:</strong> ${travelers}</p>
        <p><strong>Pickup Address:</strong> ${pickupAddress}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>End Date:</strong> ${endDate}</p>
        <p><strong>Has Passes:</strong> ${hasPasses}</p>
        <p><strong>Selected Car:</strong> ${selectedCar}</p>
        <p><strong>Car Capacity:</strong> ${car_capacity}</p>
        <p><strong>Car Price:</strong> ${car_price}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Inquiry Date:</strong> ${new Date().toLocaleString()}</p>

        
        
      `
    });

    // ——————————————
    // 2️⃣ Email the customer
    // ——————————————

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("en-US", options)
    }
  
    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,  // ← send to the user’s email
      subject: 'We’ve received your Char Dham Yatra inquiry',
      html: `
        <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Char Dham Yatra Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 20px 0;">
            <!-- Main Content Table -->
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);" width="100%" cellspacing="0" cellpadding="0" border="0">
              <!-- Header -->
              <tr>
                <td style="background-color: #1a2533; padding: 30px 40px; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Hi ${name},</h1>
                  <p style="margin: 10px 0 0 0; font-size: 16px;">Your Char Dham Yatra booking has been received!</p>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px; background-color: #ffffff;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                    Thank you for choosing us for your spiritual journey to the sacred Char Dham shrines. We've received your booking request and our team is reviewing it.
                  </p>
                  
                  <table role="presentation" style="width: 100%; margin: 30px 0; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #eeeeee;" cellspacing="0" cellpadding="0">
                    <tr>
                      <td colspan="2" style="background-color: #ffcc00; padding: 15px; text-align: center; color: #1a2533; font-weight: bold; font-size: 18px;">
                        Booking Details
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; width: 40%; color: #666666;">Package</td>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333333;">Char Dham Yatra (9 Days/10 Nights)</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; width: 40%; color: #666666;">Journey Dates</td>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333333;">${formattedStartDate} to ${formattedEndDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; width: 40%; color: #666666;">Travelers</td>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333333;">${travelers}</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; width: 40%; color: #666666;">Vehicle</td>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #333333;">${selectedCar || "To be confirmed"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; width: 40%; color: #666666;">Status</td>
                      <td style="padding: 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #ffcc00; background-color: #fffbeb;">Pending Confirmation</td>
                    </tr>
                  </table>
                  
                  <p style="margin: 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                    Our team will contact you shortly to confirm your booking details and provide further information about your journey.
                  </p>
                  
                  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #333333;">What's Next?</p>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #555555;">
                      <li style="margin-bottom: 10px;">Our team will call you within 24 hours to confirm your booking</li>
                      <li style="margin-bottom: 10px;">You'll receive a detailed itinerary for your journey</li>
                      <li style="margin-bottom: 10px;">We'll assist with any special requirements or questions you may have</li>
                    </ul>
                  </div>
                  
                  <p style="margin: 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                    If you have any questions or need immediate assistance, please contact us at:
                  </p>
                  
                  <table role="presentation" style="width: 100%; margin: 20px 0;" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <a href="tel:${process.env.SUPPORT_CONTACT}" style="display: inline-block; background-color: #ffcc00; color: #1a2533; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; text-align: center;">
                          Call or WhatsApp: ${process.env.SUPPORT_CONTACT}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #1a2533; padding: 30px 40px; text-align: center;">
                  <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; font-weight: bold;">
                    Thank you for choosing BookMyCab
                  </p>
                  <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 14px;">
                    We're committed to making your spiritual journey comfortable and memorable.
                  </p>
                  
                  <!-- Social Media Icons -->
                  <table role="presentation" style="margin: 0 auto;" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; width: 32px; height: 32px; background-color: #ffcc00; border-radius: 50%; text-align: center; line-height: 32px; color: #1a2533; text-decoration: none; font-weight: bold;">f</a>
                      </td>
                      <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; width: 32px; height: 32px; background-color: #ffcc00; border-radius: 50%; text-align: center; line-height: 32px; color: #1a2533; text-decoration: none; font-weight: bold;">in</a>
                      </td>
                      <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; width: 32px; height: 32px; background-color: #ffcc00; border-radius: 50%; text-align: center; line-height: 32px; color: #1a2533; text-decoration: none; font-weight: bold;">ig</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 20px 0 0 0; color: #999999; font-size: 12px;">
                    © ${new Date().getFullYear()} BookMyCab. All rights reserved.<br>
                    Address: Shalimar Garden EXT 1, Ghaziabad, UP, 201005
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
      `
    });

    res.status(201).json({ message: 'Inquiry saved and emails sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};