/**
 * Security utilities for input sanitization
 */

/**
 * Sanitizes a generic string input
 * - Trims whitespace
 * - Strips all HTML tags
 * - Truncates to maxLength
 */
export function sanitizeString(str, maxLength = 500) {
  if (typeof str !== 'string') return '';
  const noHtml = str.replace(/<[^>]*>?/gm, '');
  return noHtml.trim().substring(0, maxLength);
}

/**
 * Sanitizes and validates an email address
 * Returns the lowercase, trimmed email if valid, otherwise null
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return null;
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

/**
 * Sanitizes a phone number
 * Strips all non-digit characters. Validates length (e.g., 10 for India)
 */
export function sanitizePhone(phone, requiredLength = 10) {
  if (typeof phone !== 'string' && typeof phone !== 'number') return null;
  const digitsOnly = phone.toString().replace(/\D/g, '');
  // For Indian numbers, sometimes people include country code. 
  // We'll just take the last 10 digits if it's longer.
  if (digitsOnly.length >= requiredLength) {
    return digitsOnly.slice(-requiredLength);
  }
  return null;
}

/**
 * Escapes HTML entities to prevent XSS
 */
export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Convenience method for sanitizing an entire order's customer inputs
 */
export function sanitizeOrderInput(data) {
  return {
    ...data,
    customer_name: sanitizeString(data.customer_name, 100),
    customer_email: sanitizeEmail(data.customer_email),
    customer_phone: sanitizePhone(data.customer_phone),
    instagram: sanitizeString(data.instagram, 50),
    shipping_address: {
      ...data.shipping_address,
      line1: sanitizeString(data.shipping_address?.line1, 200),
      line2: sanitizeString(data.shipping_address?.line2, 200),
      city: sanitizeString(data.shipping_address?.city, 100),
      state: sanitizeString(data.shipping_address?.state, 100),
      pincode: sanitizeString(data.shipping_address?.pincode, 20),
      country: sanitizeString(data.shipping_address?.country, 50),
    },
    notes: sanitizeString(data.notes, 500),
  };
}
