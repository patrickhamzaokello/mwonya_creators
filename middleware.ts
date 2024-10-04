import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT, ARTIST_ROUTES } from '@/lib/routes';
import { loginRoleChecks } from '@/actions/loginRoleCheck';

const { auth } = NextAuth(authConfig);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/", "/(api|trpc)(.*)"]
}

export default auth(async (req) => {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
    const isArtistRoute = ARTIST_ROUTES.includes(nextUrl.pathname);

    if (isPublicRoute && isAuthenticated)
        return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

    if (!isAuthenticated && !isPublicRoute)
        return Response.redirect(new URL(ROOT, nextUrl));

    if (isArtistRoute && req.auth?.user.id) {
        const roleCheckResult = await loginRoleChecks(req.auth?.user.id);
        if (!roleCheckResult.profileStatus.hasArtistProfile) {
            return Response.redirect(new URL(ROOT, nextUrl));
        }
        return Response.redirect(new URL("/awareds", nextUrl));
    }

});
