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
      from: process.env.EMAIL_USER || 'houseofavira@gmail.com',
      to: email,
      subject: 'Complete your purchase at House of Avira',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000;">
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Hi ${name},</h2>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            We noticed you left some items in your cart at House of Avira. You have <strong>${itemCount} item(s)</strong> waiting for you.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://house-of-avira.vercel.app/checkout" 
               style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; display: inline-block;">
              Return to Cart
            </a>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">
            Best,<br>
            <strong>House of Avira</strong>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
