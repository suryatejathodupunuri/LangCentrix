import { NextResponse } from 'next/server';
import { verifyTokenEdge } from './lib/auth';
import CONFIG from '../config.js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = CONFIG.PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute =
    CONFIG.PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico');

  const token = request.cookies.get('auth-token')?.value;

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = await verifyTokenEdge(token);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('auth-token', '', { maxAge: 0 });
      return response;
    }

    return NextResponse.next();
  }

  if ((pathname === '/login' || pathname === '/signup') && token) {
    const decoded = await verifyTokenEdge(token);
    if (decoded) {
      return NextResponse.redirect(new URL(CONFIG.AUTH.LOGIN_REDIRECT, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
