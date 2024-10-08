import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { loginRoleChecks } from '@/actions/loginRoleCheck';
import { type NextRequest, NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest){
    // 1 check if route is protected
    const authRoutes = [
        '/auth/login',
        '/auth/register',
        '/auth/error',
        '/auth/reset',
        '/auth/new-password',
        '/'
    ]

    const protectedRoute = ['/studio','/artist']

    const currentPath = req.nextUrl.pathname
    const isProtectedRoute = protectedRoute.includes(currentPath)
    const isAuthRoutes = authRoutes.includes(currentPath)

    if(isAuthRoutes){
        //redirect if session is active
        const session = await auth();
        if (session?.user.id) {
          return NextResponse.redirect(new URL ("/studio", req.nextUrl));
        }
    }

    if(isProtectedRoute){
        const session = await auth();
        if (!session?.user.id) {
          return NextResponse.redirect(new URL ("/auth/login", req.nextUrl));
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/", "/(api|trpc)(.*)"]
}
