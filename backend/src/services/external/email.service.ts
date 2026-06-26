import nodemailer from 'nodemailer';
import { config } from '@/config';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${config.CORS_ORIGIN}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: `"Smart GharJagga" <${process.env.SMTP_FROM || 'noreply@smartgharjagga.com'}>`,
      to: email,
      subject: 'Verify Your Email - Smart GharJagga',
      html: `
        <h1>Welcome to Smart GharJagga!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 7 days.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${config.CORS_ORIGIN}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Smart GharJagga" <${process.env.SMTP_FROM || 'noreply@smartgharjagga.com'}>`,
      to: email,
      subject: 'Reset Your Password - Smart GharJagga',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}
