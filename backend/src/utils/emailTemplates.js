// This file contains template utilities for email content
// Most templates are now embedded in the EmailService class

class EmailTemplates {
  // Get welcome email template (for already verified users)
  static getWelcomeTemplate(userName, loginUrl) {
    return {
      subject: 'Welcome to Dayflow HRMS! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Dayflow HRMS</title>
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
            .feature-list {
              list-style: none;
              padding: 0;
              margin: 20px 0;
            }
            .feature-list li {
              background: rgba(124, 58, 237, 0.1);
              padding: 12px;
              margin: 8px 0;
              border-radius: 8px;
              border-left: 4px solid #7c3aed;
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
            <h1 style="color: #7c3aed; margin-bottom: 20px;">Welcome ${userName || 'to Dayflow'}! 🎉</h1>
            <p>Your account has been successfully created and verified. You're now ready to manage your HR operations efficiently!</p>
            
            <h3 style="color: #06b6d4; margin: 30px 0 15px 0;">What you can do:</h3>
            <ul class="feature-list">
              <li>👤 Manage your employee profile</li>
              <li>📅 Track daily attendance</li>
              <li>🏖️ Apply for leave requests</li>
              <li>💰 View salary information</li>
              <li>📊 Generate reports and analytics</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button">Go to Dashboard</a>
            </div>
            
            <div class="footer">
              <p>Need help? Contact our support team anytime.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  // Get password change confirmation template
  static getPasswordChangeConfirmation(userName) {
    return {
      subject: 'Password Changed Successfully - Dayflow HRMS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
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
            .success-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px auto;
              font-size: 40px;
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
            <div class="success-icon">✓</div>
            <h1 style="color: #10b981; margin-bottom: 20px;">Password Changed Successfully</h1>
            <p>Hi ${userName || 'there'},</p>
            <p>Your password has been successfully updated. You can now use your new password to sign in to your Dayflow HRMS account.</p>
            
            <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p><strong>Security Tip:</strong> If you didn't make this change, please contact our support team immediately.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/signin" class="button">Sign In Now</a>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  // Get account deletion notification template
  static getAccountDeletionTemplate(userName) {
    return {
      subject: 'Account Deletion Confirmation - Dayflow HRMS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Deletion</title>
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
            .warning-icon {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px auto;
              font-size: 40px;
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
            <div class="warning-icon">🗑️</div>
            <h1 style="color: #ef4444; margin-bottom: 20px;">Account Deleted Successfully</h1>
            <p>Hi ${userName || 'there'},</p>
            <p>Your Dayflow HRMS account has been permanently deleted as requested.</p>
            
            <div style="background: rgba(239, 68, 68, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p><strong>Important:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>All your personal data has been permanently removed</li>
                <li>You cannot recover your account</li>
                <li>All associated records have been anonymized</li>
              </ul>
            </div>
            
            <p>If you change your mind in the future, you're always welcome to create a new account.</p>
            
            <div class="footer">
              <p>We're sorry to see you go. Thank you for using Dayflow HRMS!</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
}

module.exports = EmailTemplates;