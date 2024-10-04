import { prisma } from "@/lib/prisma";

// token functionality
export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });
        return passwordResetToken;
    } catch {
        return null;
    }
}

// Token Email functionality (match emails)
export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email }
        });
        return passwordResetToken;
    } catch {
        return null;
    }
}