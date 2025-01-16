import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default async function middleware(request: any) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Redirect authenticated users from auth pages to studio
  if (pathname.startsWith('/auth/')) {
    if (session) {
      return NextResponse.redirect(new URL('/studio', request.url));
    }
    return NextResponse.next();
  }

  // Protect /studio and /artist routes
  if (pathname.startsWith('/studio') || pathname.startsWith('/artist')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*', '/artist/:path*', '/auth/:path*']
}