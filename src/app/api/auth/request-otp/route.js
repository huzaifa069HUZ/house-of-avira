import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Basic Rate Limiting
    const otpRef = adminDb.collection('otps').doc(sanitizedEmail);
    const docSnap = await otpRef.get();
    
    if (docSnap.exists) {
      const data = docSnap.data();
      const timeSinceLastRequest = Date.now() - (data.lastRequest || 0);
      
      // Prevent requesting more than once per minute
      if (timeSinceLastRequest < 60000) {
        return NextResponse.json({ success: false, message: "Please wait 1 minute before requesting a new OTP." }, { status: 429 });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Store in Firestore
    await otpRef.set({
      otp,
      expiresAt,
      lastRequest: Date.now()
    });

    // Send Email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'placeholder@gmail.com',
        pass: process.env.EMAIL_PASS || 'placeholder_password',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'placeholder@gmail.com',
      to: sanitizedEmail,
      subject: 'Your House of Avira Verification Code',
      html: `
        <div style="font-family: sans-serif; max-w: 500px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2>House of Avira</h2>
          <p>Your verification code for account creation is:</p>
          <h1 style="font-size: 36px; letter-spacing: 4px; color: #000;">${otp}</h1>
          <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "OTP sent successfully." });

  } catch (error) {
    console.error("Error requesting OTP:", error);
    return NextResponse.json({ success: false, message: "Failed to send OTP." }, { status: 500 });
  }
}
