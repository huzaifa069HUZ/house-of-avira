import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: "Email and OTP are required." }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Fetch the OTP document
    const otpRef = adminDb.collection('otps').doc(sanitizedEmail);
    const docSnap = await otpRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP." }, { status: 401 });
    }

    const data = docSnap.data();

    // Check expiration
    if (Date.now() > data.expiresAt) {
      await otpRef.delete(); // Cleanup expired
      return NextResponse.json({ success: false, message: "OTP has expired. Please request a new one." }, { status: 401 });
    }

    // Check OTP match
    if (data.otp !== otp.toString().trim()) {
      return NextResponse.json({ success: false, message: "Incorrect OTP." }, { status: 401 });
    }

    // If valid, delete immediately to prevent replay attacks
    await otpRef.delete();

    return NextResponse.json({ success: true, message: "Email verified successfully." });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
