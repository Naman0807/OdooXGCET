const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Test email connection
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send messages');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  // Generate verification token
  generateVerificationToken() {
    return uuidv4();
  }

  // Calculate token expiration (24 hours from now)
  getTokenExpiration() {
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  // Send verification email
  async sendVerificationEmail(email, token, userName, purpose = 'registration') {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
      const template = this.getEmailVerificationTemplate(verificationUrl, userName, purpose);
      
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Dayflow HRMS" <noreply@dayflow.com>',
        to: email,
        subject: template.subject,
        html: template.html,
      });

      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Get email verification template
  getEmailVerificationTemplate(verificationUrl, userName, purpose) {
    const templates = {
      registration: {
        subject: 'Verify Your Email Address - Dayflow HRMS',
        html: this.getRegistrationTemplate(verificationUrl, userName)
      },
      password_reset: {
        subject: 'Reset Your Password - Dayflow HRMS',
        html: this.getPasswordResetTemplate(verificationUrl, userName)
      },
      email_change: {
        subject: 'Verify Your New Email - Dayflow HRMS',
        html: this.getEmailChangeTemplate(verificationUrl, userName)
      }
    };

    return templates[purpose] || templates.registration;
  }

  // Registration email template
  getRegistrationTemplate(verificationUrl, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            background-color: #1f2937;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #374151;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          .logo {
            color: #7c3aed;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
          }
          .button {
            background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .link-text {
            color: #9ca3af;
            font-size: 14px;
            word-break: break-all;
          }
          .footer {
            color: #6b7280;
            font-size: 12px;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🚀 Dayflow HRMS</div>
          <h1 style="color: #7c3aed; margin-bottom: 20px;">Welcome to Dayflow HRMS!</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>Thank you for registering! Please click the button below to verify your email address and activate your account:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p class="link-text">${verificationUrl}</p>
          
          <div class="footer">
            <p>This link expires in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Password reset template
  getPasswordResetTemplate(verificationUrl, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body {
            background-color: #1f2937;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #374151;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          .logo {
            color: #7c3aed;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
          }
          .button {
            background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .link-text {
            color: #9ca3af;
            font-size: 14px;
            word-break: break-all;
          }
          .footer {
            color: #6b7280;
            font-size: 12px;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🚀 Dayflow HRMS</div>
          <h1 style="color: #ef4444; margin-bottom: 20px;">Reset Your Password</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p class="link-text">${verificationUrl}</p>
          
          <div class="footer">
            <p>This link expires in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Email change template
  getEmailChangeTemplate(verificationUrl, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            background-color: #1f2937;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #374151;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          .logo {
            color: #7c3aed;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 30px;
          }
          .button {
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
          }
          .link-text {
            color: #9ca3af;
            font-size: 14px;
            word-break: break-all;
          }
          .footer {
            color: #6b7280;
            font-size: 12px;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🚀 Dayflow HRMS</div>
          <h1 style="color: #10b981; margin-bottom: 20px;">Verify Your New Email</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>Please click the button below to verify your new email address:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button">Verify New Email</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p class="link-text">${verificationUrl}</p>
          
          <div class="footer">
            <p>This link expires in 24 hours.</p>
            <p>If you didn't request this change, please contact support immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailService;