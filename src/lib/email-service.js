// ─── Email Service — Reusable Nodemailer Abstraction ───
// Handles all shipping-related email templates and sending

import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'houseofavira@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });
}

const BRAND = {
  name: 'House of Avira',
  email: process.env.EMAIL_USER || 'houseofavira@gmail.com',
  website: 'https://houseofavira.shop',
  year: new Date().getFullYear(),
};

// ── Shared HTML wrapper ──
function wrapHtml(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
      </style>
    </head>
    <body style="font-family: 'DM Sans', Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; margin: 0;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; padding: 48px 40px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        
        <div style="text-align: center; margin-bottom: 36px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0;">
          <h1 style="font-size: 18px; font-weight: 700; color: #000000; letter-spacing: 3px; text-transform: uppercase; margin: 0;">
            HOUSE OF AVIRA
          </h1>
        </div>
        
        ${content}
        
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f0f0f0; text-align: center;">
          <p style="font-size: 12px; color: #999999; line-height: 1.6; margin: 0;">
            If you have any questions, simply reply to this email.<br>
            We're always here to help.
          </p>
          <p style="font-size: 11px; color: #bbbbbb; margin-top: 16px;">
            &copy; ${BRAND.year} House of Avira. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ── Shipping Invoice Email ──
export function generateShippingInvoiceHtml({ customerName, orderId, shippingAmount, dueDate, batchRef, currencySymbol = '₹' }) {
  const dueDateStr = dueDate ? new Date(dueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'As soon as possible';

  const content = `
    <h2 style="font-size: 22px; font-weight: 500; color: #000000; margin: 0 0 8px 0;">
      Hi ${customerName},
    </h2>
    <p style="font-size: 14px; color: #666666; line-height: 1.7; margin: 0 0 28px 0;">
      Your shipment batch has been processed! Below is your shipping &amp; import cost for your order.
    </p>
    
    <div style="background-color: #fafafa; border-radius: 10px; padding: 24px; margin-bottom: 28px; border: 1px solid #f0f0f0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="color: #888888; padding: 6px 0; font-weight: 500;">Order ID</td>
          <td style="color: #000000; text-align: right; padding: 6px 0; font-weight: 600;">${orderId}</td>
        </tr>
        ${batchRef ? `
        <tr>
          <td style="color: #888888; padding: 6px 0; font-weight: 500;">Batch Reference</td>
          <td style="color: #000000; text-align: right; padding: 6px 0; font-weight: 600;">${batchRef}</td>
        </tr>` : ''}
        <tr>
          <td style="color: #888888; padding: 6px 0; font-weight: 500;">Due Date</td>
          <td style="color: #000000; text-align: right; padding: 6px 0; font-weight: 600;">${dueDateStr}</td>
        </tr>
        <tr style="border-top: 2px solid #e8e8e8;">
          <td style="color: #000000; padding: 14px 0 6px 0; font-weight: 700; font-size: 15px;">Shipping Amount Due</td>
          <td style="color: #000000; text-align: right; padding: 14px 0 6px 0; font-weight: 800; font-size: 20px;">${currencySymbol}${shippingAmount}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #f0f7ff; border-radius: 10px; padding: 18px 20px; margin-bottom: 28px; border: 1px solid #dbeafe;">
      <p style="font-size: 13px; color: #1e40af; line-height: 1.6; margin: 0;">
        <strong>Note:</strong> This is your second payment for this order. You have already paid the product price. 
        This shipping charge covers the international sourcing and import costs for your items.
      </p>
    </div>
    
    <div style="text-align: center; margin-bottom: 12px;">
      <a href="${BRAND.website}" 
         style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 36px; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-radius: 6px;">
        Pay Now
      </a>
    </div>
    
    <p style="font-size: 13px; color: #888888; text-align: center; line-height: 1.6; margin: 0;">
      Please complete this payment to proceed with shipping your order.
    </p>
  `;

  return wrapHtml(content);
}

// ── Shipping Payment Received Email ──
export function generatePaymentReceivedHtml({ customerName, orderId, amount, currencySymbol = '₹' }) {
  const content = `
    <h2 style="font-size: 22px; font-weight: 500; color: #000000; margin: 0 0 8px 0;">
      Hi ${customerName},
    </h2>
    <p style="font-size: 14px; color: #666666; line-height: 1.7; margin: 0 0 28px 0;">
      We've received your shipping payment. Your order is now being prepared for dispatch!
    </p>
    
    <div style="background-color: #f0fdf4; border-radius: 10px; padding: 24px; margin-bottom: 28px; border: 1px solid #bbf7d0;">
      <div style="text-align: center;">
        <div style="font-size: 36px; margin-bottom: 8px;">✓</div>
        <p style="font-size: 13px; color: #166534; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">
          Payment Confirmed
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; max-width: 280px; margin: 0 auto;">
          <tr>
            <td style="color: #15803d; padding: 4px 0; font-weight: 500;">Order ID</td>
            <td style="color: #15803d; text-align: right; padding: 4px 0; font-weight: 700;">${orderId}</td>
          </tr>
          <tr>
            <td style="color: #15803d; padding: 4px 0; font-weight: 500;">Amount Paid</td>
            <td style="color: #15803d; text-align: right; padding: 4px 0; font-weight: 700;">${currencySymbol}${amount}</td>
          </tr>
        </table>
      </div>
    </div>
    
    <p style="font-size: 14px; color: #555555; line-height: 1.7; margin: 0;">
      We'll notify you with tracking details once your order has shipped. Thank you for shopping with House of Avira!
    </p>
  `;

  return wrapHtml(content);
}

// ── Send Email Functions ──
export async function sendShippingInvoiceEmail({ customerEmail, customerName, orderId, shippingAmount, dueDate, batchRef, currencySymbol }) {
  const transporter = createTransporter();

  const html = generateShippingInvoiceHtml({ customerName, orderId, shippingAmount, dueDate, batchRef, currencySymbol });

  const mailOptions = {
    from: `"House of Avira" <${BRAND.email}>`,
    to: customerEmail,
    subject: `Shipping Payment Due — Order ${orderId}`,
    html,
    text: `Hi ${customerName},\n\nYour shipment batch has been processed. Your shipping amount due for Order ${orderId} is ${currencySymbol || '₹'}${shippingAmount}.\n\nThis is your second payment for this order — the shipping & import cost.\n\nDue date: ${dueDate ? new Date(dueDate).toLocaleDateString() : 'As soon as possible'}\n\nPlease visit ${BRAND.website} to complete your payment.\n\nThank you,\nThe House of Avira Team`,
    replyTo: BRAND.email,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendShippingPaymentReceivedEmail({ customerEmail, customerName, orderId, amount, currencySymbol }) {
  const transporter = createTransporter();

  const html = generatePaymentReceivedHtml({ customerName, orderId, amount, currencySymbol });

  const mailOptions = {
    from: `"House of Avira" <${BRAND.email}>`,
    to: customerEmail,
    subject: `Shipping Payment Received — Order ${orderId}`,
    html,
    text: `Hi ${customerName},\n\nWe've received your shipping payment of ${currencySymbol || '₹'}${amount} for Order ${orderId}.\n\nYour order is now being prepared for dispatch. We'll notify you with tracking details once shipped.\n\nThank you for shopping with House of Avira!`,
    replyTo: BRAND.email,
  };

  await transporter.sendMail(mailOptions);
}
