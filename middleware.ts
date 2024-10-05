import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { DEFAULT_LOGIN_REDIRECT,CREATE_ARTIST_PROFILE,  ROOT, ARTIST_ROUTES } from '@/lib/routes';
import { loginRoleChecks } from '@/actions/loginRoleCheck';

const { auth } = NextAuth(authConfig);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/", "/(api|trpc)(.*)"]
}

export default auth(async (req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    const isROOT = ROOT.includes(nextUrl.pathname);
    const isArtistRoute = ARTIST_ROUTES.includes(nextUrl.pathname);

    if (isROOT && isAuthenticated)
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));

    if (isArtistRoute && req.auth?.user.id) {
        const roleCheckResult = await loginRoleChecks(req.auth?.user.id);
        if (!roleCheckResult.profileStatus.hasArtistProfile) {
            return Response.redirect(new URL(CREATE_ARTIST_PROFILE, nextUrl));
        }
        return Response.redirect(new URL("/awareds", nextUrl));
     }
});
