import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, htmlContent) => {
  console.log("📨 ATTEMPTING TO SEND EMAIL...");
  console.log(`👉 To: ${to}`);
  console.log(`👉 User: ${process.env.EMAIL_USER}`);
  // Show only first 3 chars of password for security check
  console.log(`👉 Pass Loaded: ${process.env.EMAIL_PASS ? "YES (Starts with " + process.env.EMAIL_PASS.substring(0,3) + ")" : "NO ❌"}`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Zyra Systems" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ CRITICAL EMAIL ERROR:", error);
    return false;
  }
};

export default sendEmail;