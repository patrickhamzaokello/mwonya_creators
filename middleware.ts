import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';
const { auth } = NextAuth(authConfig);

export default async function middleware(request: any) {
  const { pathname } = request.nextUrl;
  
  // Only check the session if the route requires it
  if (pathname.startsWith('/studio') || pathname.startsWith('/artist')) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // Redirect authenticated users from auth pages
  if (pathname.startsWith('/auth/')) {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL('/studio', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*', '/artist/:path*', '/auth/:path*'],
};