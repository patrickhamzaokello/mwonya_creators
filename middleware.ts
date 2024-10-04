import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { DEFAULT_LOGIN_REDIRECT,  ROOT, ARTIST_ROUTES } from '@/lib/routes';
import { loginRoleChecks } from '@/actions/loginRoleCheck';

const { auth } = NextAuth(authConfig);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/", "/(api|trpc)(.*)"]
}

export default auth(async (req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    const isROOT = ROOT.includes(nextUrl.pathname);

    if (isROOT && isAuthenticated)
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));

});
