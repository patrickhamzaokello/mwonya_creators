import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getDeleteExpiredTokens } from "@/data-layer/verification-token"
import { UserRole } from "@/types/user"
import { getUserById } from "@/data-layer/user"

export const authConfig = {
    trustHost: true,
    adapter: PrismaAdapter(prisma) as any,
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60, // 30 days (this is in seconds)
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        authorized({ auth }) {
            const isAuthenticated = !!auth?.user;

            return isAuthenticated;
        },
        async signIn({ user, account }) {

            if (account?.provider !== "credentials") return true;

            const exisitingUser = await getUserById(user.id ?? '');

            if (!exisitingUser?.emailVerified) return false;

            return true;

        },

        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token;
            await getDeleteExpiredTokens()
            const exisitingUser = await getUserById(token.sub);

            if (!exisitingUser) return token;

            token.role = exisitingUser.role;
            return token;
        },
    },
    providers: [],
} satisfies NextAuthConfig;