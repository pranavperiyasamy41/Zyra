import sendEmail from '../utils/sendEmail.js';

export const sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!email || !message || !firstName) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
      <h2 style="color: #064E48; border-bottom: 2px solid #064E48; padding-bottom: 10px;">New Contact Form Submission</h2>
      <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
      <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; pt: 10px;">
        Sent from Zyra Pharmacy Contact Page
      </p>
    </div>
  `;

  try {
    const success = await sendEmail(
      'zyra.pharmacy@gmail.com', 
      `[Contact Form] ${subject}: From ${firstName}`, 
      htmlContent
    );

    if (success) {
      res.status(200).json({ message: 'Email sent successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to send email. Please try again later.' });
    }
  } catch (error) {
    console.error('Contact Controller Error:', error);
    res.status(500).json({ message: 'Server error while sending email.' });
  }
};