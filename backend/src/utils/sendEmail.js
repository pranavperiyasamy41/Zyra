import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, htmlContent) => {
  console.log("📨 ATTEMPTING TO SEND EMAIL VIA GMAIL API (HTTPS)...");
  
  const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
  const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
  const SENDER_EMAIL = process.env.EMAIL_USER;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    console.error("❌ MISSING GMAIL API CREDENTIALS. Please check GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN in environment variables.");
    return false;
  }

  try {
    const oauth2Client = new OAuth2Client(
      CLIENT_ID,
      CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const { token } = await oauth2Client.getAccessToken();

    if (!token) {
        throw new Error("Failed to generate Access Token from Refresh Token.");
    }

    // Construct RFC 2822 message
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: "Zyra Systems" <${SENDER_EMAIL}>`,
      `To: ${to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      htmlContent
    ];
    const message = messageParts.join('\n');

    // The body needs to be base64url encoded
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await axios.post(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
      { raw: encodedMessage },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ Email sent successfully via API! ID:", response.data.id);
    return true;
  } catch (error) {
    console.error("❌ GMAIL API ERROR:");
    if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Status:", error.response.status);
    } else {
        console.error("Message:", error.message);
    }
    return false;
  }
};

export default sendEmail;