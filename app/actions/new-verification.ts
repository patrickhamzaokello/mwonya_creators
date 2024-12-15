"use server";

import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data-layer/user";

import { getDeleteTokenbyID, getVerificationTokenByToken, updateUserEmailVerfied } from "@/data-layer/verification-token";

export const newVerification = async (token:string) => {

    
    // if no token, display message
    const exisitingToken = await getVerificationTokenByToken(token);

    if(!exisitingToken) {
        return { error: "Token does not exisit 😣" };
    }

    const normalizeToDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // if token has expired, display message
    const hasExpired = normalizeToDate(new Date(exisitingToken.expires)) < normalizeToDate(new Date());

    if (hasExpired) {
        return { error: "Token has expired 😣" };
    }
    // if user does not exist, display message
    const existingUser = await getUserByEmail(exisitingToken.email);

    if (!existingUser) {
        return { error: "User does not exisit 😬" };
    }
    await updateUserEmailVerfied(existingUser.id, exisitingToken.email, new Date())
    // delete token
    await getDeleteTokenbyID(exisitingToken.id);

    return { success: "Email verified 🎉. Go to login to continue"}
}