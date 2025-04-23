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

// console.log("SMTP Configured with Gmail" , process.env.EMAIL_USER , process.env.EMAIL_PASS);

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <h3>Email Verification</h3>
      <p>Your OTP code is <b>${otp}</b></p>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTPEmail;
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const testEmail = async () => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
  

//   transporter.verify(function (error, success) {
//     if (error) {
//       console.error("SMTP Verify Error:", error);
//     } else {
//       console.log("Server is ready to take messages ✅");
//     }
//   });
// };

// testEmail();
