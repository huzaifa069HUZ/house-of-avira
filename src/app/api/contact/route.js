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
      subject: `NEW INQUIRY: Contact Form Submission from ${name}`,
      text: `
NEW INQUIRY
-----------------------------
Name: ${name}
Email: ${email}
Categories: ${categories.join(', ') || 'None selected'}

Project/Inquiry Info:
${projectInfo}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #000000; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">NEW INQUIRY</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <h2 style="color: #333333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 120px; color: #666666; font-weight: bold;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666666; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <a href="mailto:${email}" style="color: #000000; text-decoration: underline;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666666; font-weight: bold;">Categories:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333333;">
                  <span style="background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 14px;">
                    ${categories.join(', ') || 'None selected'}
                  </span>
                </td>
              </tr>
            </table>
            
            <h2 style="color: #333333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Inquiry Details</h2>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #000000; color: #444444; line-height: 1.6; white-space: pre-wrap;">${projectInfo.replace(/\n/g, '<br>')}</div>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; color: #888888; font-size: 12px;">
            This email was sent securely from the House of Avira contact form.
          </div>
        </div>
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
