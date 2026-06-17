import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, projectInfo, categories } = await request.json();

    // Warn if missing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("EMAIL_USER or EMAIL_PASS is not set in environment variables.");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'placeholder@gmail.com',
        pass: process.env.EMAIL_PASS || 'placeholder_password',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'placeholder@gmail.com',
      to: 'houseofavira@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Categories: ${categories.join(', ') || 'None selected'}

Project/Inquiry Info:
${projectInfo}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Categories:</strong> ${categories.join(', ') || 'None selected'}</p>
        <h3>Project/Inquiry Info:</h3>
        <p>${projectInfo.replace(/\n/g, '<br>')}</p>
      `
    };

    // We will attempt to send it. If auth fails because no .env exists, it'll be caught below.
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    // If the user doesn't have EMAIL_USER/EMAIL_PASS configured locally, it will fail here.
    // We still return success: false so the frontend shows the error state.
    return NextResponse.json({ success: false, message: "Failed to send email. Ensure EMAIL_USER and EMAIL_PASS are set." }, { status: 500 });
  }
}
