import { NextResponse } from 'next/server';

export function proxy(request) {
  const { geo } = request;
  
  // Vercel populates request.geo or you can check headers
  const country = geo?.country || request.headers.get('x-vercel-ip-country') || 'US';

  let locale = 'en';
  let currency = 'USD';

  switch (country) {
    case 'IN':
      locale = 'en';
      currency = 'INR';
      break;
    case 'US':
      locale = 'en';
      currency = 'USD';
      break;
    case 'GB':
      // Great Britain (United Kingdom)
      locale = 'en';
      currency = 'GBP';
      break;
    case 'PH':
      // Philippines
      locale = 'tl';
      currency = 'PHP';
      break;
    default:
      // Default fallback
      locale = 'en';
      currency = 'USD';
  }

  // Allow users to override by checking if cookies already exist
  const existingLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const existingCurrency = request.cookies.get('USER_CURRENCY')?.value;

  const response = NextResponse.next();

  if (!existingLocale) {
    response.cookies.set('NEXT_LOCALE', locale, { maxAge: 60 * 60 * 24 * 30, path: '/' });
  }
  
  if (!existingCurrency) {
    response.cookies.set('USER_CURRENCY', currency, { maxAge: 60 * 60 * 24 * 30, path: '/' });
  }

  return response;
}

// Ensure the proxy only runs on page routes, not static files or API routes (unless desired)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
