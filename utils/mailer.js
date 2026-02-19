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

const templates = {
  signup: {
    subject: "Verify Your Account - BookMyCab",
    heading: "Account Verification",
    message: "Please use the OTP below to verify your email and activate your BookMyCab account.",
  },
  "reset-password": {
    subject: "Reset Your Password - BookMyCab",
    heading: "Password Reset",
    message: "You requested a password reset. Use the OTP below to set a new password.",
  },
  "resend-otp": {
    subject: "Your OTP Code - BookMyCab",
    heading: "OTP Verification",
    message: "Here is your new OTP code. Use it to verify your email.",
  },
};

const sendOTPEmail = async (to, otp, purpose = "signup") => {
  const tpl = templates[purpose] || templates.signup;

  const mailOptions = {
    from: `"BookMyCab" <${process.env.EMAIL_USER}>`,
    to,
    subject: tpl.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background-color: #f59e0b; padding: 16px; text-align: center;">
          <h1 style="color: #000; margin: 0; font-size: 22px;">BookMyCab</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <h2 style="margin-top: 0; color: #111827;">${tpl.heading}</h2>
          <p style="color: #374151;">${tpl.message}</p>
          <div style="background: #fff; border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This OTP will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Need help? Contact us at <a href="tel:+918470006336" style="color: #f59e0b;">+91 84700 06336</a>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTPEmail;
