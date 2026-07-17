import { NextResponse } from 'next/server';

export function proxy(request) {
  const response = NextResponse.next();

  if (!request.cookies.get('NEXT_LOCALE')?.value) {
    response.cookies.set('NEXT_LOCALE', 'en', { maxAge: 60 * 60 * 24 * 30, path: '/' });
  }

  if (!request.cookies.get('USER_CURRENCY')?.value) {
    response.cookies.set('USER_CURRENCY', 'INR', { maxAge: 60 * 60 * 24 * 30, path: '/' });
  }

  return response;
}

// Ensure the proxy only runs on page routes, not static files or API routes (unless desired)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
