// backend/src/utils/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10), // Default to 587 if not set
  secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for secure, 'false' for insecure
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender address
      to, // List of recipients
      subject, // Subject line
      text, // Plain text body
      html, // HTML body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendPasswordResetOtpEmail = async (to, otp, expiresInMinutes) => {
  const appName = process.env.APP_NAME || 'Finance Tracker';
  const subject = `${appName} - Password Reset OTP`;
  const text = `Your ${appName} password reset OTP is ${otp}. It will expire in ${expiresInMinutes} minutes. If you did not request this, please ignore this email.`;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="color: #111827; margin-bottom: 0.5rem;">${appName} Password Reset</h2>
      <p>We received a request to reset the password for your ${appName} account.</p>
      <p style="margin: 1.5rem 0; font-size: 1.25rem;">
        Your one-time password (OTP) is:
        <strong style="display: inline-block; padding: 0.5rem 1rem; border-radius: 0.375rem; background-color: #111827; color: #F9FAFB; letter-spacing: 0.2em;">
          ${otp}
        </strong>
      </p>
      <p>This code will expire in <strong>${expiresInMinutes} minutes</strong> and can be used only once.</p>
      <p>If you did not request a password reset, you can safely ignore this email. Someone may have entered your email address by mistake.</p>
      <p style="margin-top: 2rem;">Best regards,<br />The ${appName} Team</p>
    </div>
  `;

  return sendEmail(to, subject, text, html);
};
