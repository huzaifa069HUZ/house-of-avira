import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sanitizeString, sanitizeEmail, sanitizeHtml } from '@/lib/sanitize';

export async function POST(request) {
  try {
    const rawBody = await request.json();
    const email = sanitizeEmail(rawBody.email);
    const name = sanitizeString(rawBody.name, 100);
    const subject = sanitizeString(rawBody.subject, 200);
    const message = sanitizeHtml(sanitizeString(rawBody.message, 5000));
    const link = sanitizeString(rawBody.link, 500);

    if (!email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields or invalid email' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'houseofavira@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
    });

    const ctaHtml = link ? `
      <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
        <a href="${link}" 
           style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 4px;">
          View Catalogue
        </a>
      </div>
    ` : '';

    // Convert newlines in message to <br> tags
    const formattedMessage = message.replace(/\n/g, '<br>');

    const mailOptions = {
      from: `"House of Avira" <${process.env.EMAIL_USER || 'houseofavira@gmail.com'}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          </style>
        </head>
        <body style="font-family: 'DM Sans', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; margin: 0;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: left;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 22px; font-weight: 700; color: #000000; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
                HOUSE OF AVIRA
              </h1>
            </div>
            
            <h2 style="font-size: 18px; font-weight: 500; color: #000000; margin-bottom: 20px;">
              Hi ${name || 'there'},
            </h2>
            
            <div style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 30px;">
              ${formattedMessage}
            </div>
            
            ${ctaHtml}
            
            <p style="font-size: 13px; color: #888888; line-height: 1.5; margin-bottom: 0; margin-top: 30px;">
              If you have any questions, simply reply to this email. We're here to help.<br><br>
              Stay inspired,<br>
              <strong style="color: #000000;">The House of Avira Team</strong>
            </p>
            
          </div>
          
          <div style="max-width: 500px; margin: 20px auto 0; text-align: center; color: #999999; font-size: 11px;">
            © ${new Date().getFullYear()} House of Avira. All rights reserved.<br>
            You are receiving this because you are registered on our site.
          </div>
        </body>
        </html>
      `,
      replyTo: process.env.EMAIL_USER || 'houseofavira@gmail.com',
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
