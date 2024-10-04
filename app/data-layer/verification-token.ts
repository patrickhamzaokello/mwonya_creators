import { prisma } from "@/lib/prisma";

export const getVerificationTokenByToken= async (
    token: string
) => {
    // Get Verification Token
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });

        return verificationToken;
    } catch {
        return null
    }
}

export const getVerificationTokenByEmail = async (
    email: string
) => {
    // Get Email Verification 
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { email }
        });

        return verificationToken;
    } catch {
        return null
    }
}


export const getDeleteExpiredTokens = async ()=>{
    try {
        const deleteToken = await prisma.verificationToken.deleteMany({
            where: {
                expires: {
                    lt: new Date()
                }
            }
        });
    } catch (error) {
        return null
    }
}