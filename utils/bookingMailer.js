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

const sendBookingConfirmationEmail = async (to, bookingDetails) => {
  const {
    bookingId,
    passengerName,
    cabName,
    pickupLocation,
    dropLocation,
    scheduledAt,
    totalAmount,
    paymentType,
  } = bookingDetails;

  const formattedDate = new Date(scheduledAt).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: `"BookMyCab" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Confirmed - ${cabName} | BookMyCab`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
          <h1 style="color: #000; margin: 0;">BookMyCab</h1>
        </div>

        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #16a34a;">Booking Confirmed!</h2>
          <p>Dear ${passengerName || "Customer"},</p>
          <p>Your cab booking has been confirmed. Here are the details:</p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            ${bookingId ? `<p><strong>Booking ID:</strong> ${bookingId}</p>` : ""}
            <p><strong>Cab:</strong> ${cabName}</p>
            <p><strong>From:</strong> ${pickupLocation}</p>
            <p><strong>To:</strong> ${dropLocation}</p>
            <p><strong>Pickup Time:</strong> ${formattedDate}</p>
            <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
            <p><strong>Payment:</strong> ${paymentType === "to_driver" ? "Pay on Pickup" : "Online"}</p>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Important:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Cab & driver details will be shared 30 mins before ride</li>
              <li>Please be ready 5 mins before pickup time</li>
              <li>Free cancellation available till 1 hr before ride</li>
            </ul>
          </div>

          <p>For any queries, contact us:</p>
          <p><strong>Phone:</strong> <a href="tel:+918470006336">+91 84700 06336</a></p>
          <p><strong>Email:</strong> <a href="mailto:info@bookmycab.co">info@bookmycab.co</a></p>
        </div>

        <div style="background-color: #232221; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} BookMyCab. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendBookingConfirmationEmail;
