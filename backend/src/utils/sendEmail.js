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
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Port 465 uses SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      family: 4, // 🚀 CRITICAL: Force IPv4. Gmail often times out over IPv6 on Render.
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 15000,
      socketTimeout: 20000
    });

    console.log("🔗 SMTP Connection initialized. Sending...");

    const info = await transporter.sendMail({
      from: `"Zyra Systems" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ CRITICAL EMAIL ERROR:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Code:", error.code);
    console.error("Command:", error.command);
    return false;
  }
};

export default sendEmail;