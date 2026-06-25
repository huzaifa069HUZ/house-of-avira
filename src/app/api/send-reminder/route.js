import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, itemCount } = body;

    if (!email || !name || !itemCount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'houseofavira@gmail.com',
        pass: process.env.EMAIL_PASS, // Needs to be set in .env.local
      },
    });

    const mailOptions = {
      from: `"House of Avira" <${process.env.EMAIL_USER || 'houseofavira@gmail.com'}>`,
      to: email,
      subject: 'You left something behind...',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          </style>
        </head>
        <body style="font-family: 'DM Sans', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; margin: 0;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
            
            <h1 style="font-size: 22px; font-weight: 700; color: #000000; letter-spacing: 2px; text-transform: uppercase; margin-top: 0; margin-bottom: 30px;">
              HOUSE OF AVIRA
            </h1>
            
            <h2 style="font-size: 20px; font-weight: 500; color: #000000; margin-bottom: 20px;">
              Hi ${name},
            </h2>
            
            <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 30px;">
              We noticed you were browsing our collections and left <strong>${itemCount} item(s)</strong> waiting in your cart. 
              Our pieces are highly curated and often sell out fast. 
            </p>
            
            <a href="https://house-of-avira.vercel.app/checkout" 
               style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 4px; margin-bottom: 30px;">
              Return to Your Cart
            </a>
            
            <p style="font-size: 13px; color: #888888; line-height: 1.5; margin-bottom: 0;">
              If you have any questions or need styling advice, simply reply to this email. We're here to help.<br><br>
              Stay inspired,<br>
              <strong style="color: #000000;">The House of Avira Team</strong>
            </p>
            
          </div>
          
          <div style="max-width: 500px; margin: 20px auto 0; text-align: center; color: #999999; font-size: 11px;">
            © ${new Date().getFullYear()} House of Avira. All rights reserved.<br>
            You are receiving this because you visited our site.
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
