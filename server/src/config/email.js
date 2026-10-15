const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email configuration is incomplete. Email sending will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    // For development: return a special object with the reset URL
    // This allows testing without email configuration
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    console.warn('Email not configured. Development mode - reset URL:', resetUrl);
    
    // Return a mock successful response for development
    return {
      messageId: 'dev-mode-no-email',
      developmentMode: true,
      resetUrl: resetUrl,
    };
  }

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Smart Society Management" <${fromEmail}>`,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>Hello ${user.fullName},</p>
        <p>We received a request to reset your password for your Smart Digital Society Management System account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4f46e5;">${resetUrl}</p>
        <p><strong>This link will expire in 30 minutes.</strong></p>
        <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Smart Digital Society Management System<br>
          This is an automated email, please do not reply.
        </p>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hello ${user.fullName},
      
      We received a request to reset your password for your Smart Digital Society Management System account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 30 minutes.
      
      If you didn't request this password reset, please ignore this email and your password will remain unchanged.
      
      Smart Digital Society Management System
      This is an automated email, please do not reply.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  createTransporter,
  sendPasswordResetEmail,
};