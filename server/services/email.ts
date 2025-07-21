import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER || 'fsocietycipherrevolt@gmail.com';
const emailPass = process.env.EMAIL_PASS || 'aknz caun egok ihri';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

export async function sendVerificationEmail(email: string, code: string, name: string) {
  const mailOptions = {
    from: {
      name: 'COMMUNITY HUB',
      address: emailUser
    },
    to: email,
    subject: 'Verify Your Email - COMMUNITY HUB',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .code { background-color: #f8f9fa; border: 2px dashed #1976D2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code-number { font-size: 32px; font-weight: bold; color: #1976D2; letter-spacing: 3px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to COMMUNITY HUB</h1>
            <p>Email Verification Required</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for joining COMMUNITY HUB. To complete your registration, please verify your email address using the code below:</p>
            
            <div class="code">
              <p style="margin: 0; font-size: 16px; color: #666;">Your verification code is:</p>
              <div class="code-number">${code}</div>
              <p style="margin: 0; font-size: 14px; color: #666;">This code will expire in 15 minutes</p>
            </div>
            
            <p>If you didn't create an account with COMMUNITY HUB, please ignore this email.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>COMMUNITY HUB Team</strong>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0; color: #666; font-size: 14px;">Powered by John Reese</p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">©2025 All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, code: string, name: string) {
  const mailOptions = {
    from: {
      name: 'COMMUNITY HUB',
      address: emailUser
    },
    to: email,
    subject: 'Password Reset - COMMUNITY HUB',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .code { background-color: #f8f9fa; border: 2px dashed #1976D2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code-number { font-size: 32px; font-weight: bold; color: #1976D2; letter-spacing: 3px; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>COMMUNITY HUB</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>You requested to reset your password. Use the code below to reset your password:</p>
            
            <div class="code">
              <p style="margin: 0; font-size: 16px; color: #666;">Your reset code is:</p>
              <div class="code-number">${code}</div>
              <p style="margin: 0; font-size: 14px; color: #666;">This code will expire in 15 minutes</p>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>COMMUNITY HUB Team</strong>
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0; color: #666; font-size: 14px;">Powered by John Reese</p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">©2025 All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendFeedbackNotification(userEmail: string, userName: string, rating: number, message: string) {
  const mailOptions = {
    from: {
      name: 'COMMUNITY HUB',
      address: emailUser
    },
    to: emailUser,
    subject: 'New Feedback Received - COMMUNITY HUB',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .rating { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Feedback Received</h1>
            <p>COMMUNITY HUB Admin Panel</p>
          </div>
          <div class="content">
            <h2>Feedback Details</h2>
            <p><strong>User:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            
            <div class="rating">
              <p><strong>Rating:</strong> ${rating}/10</p>
              <p><strong>Message:</strong></p>
              <p style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1976D2;">${message}</p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0; color: #666; font-size: 14px;">Powered by John Reese</p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">©2025 All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
}
