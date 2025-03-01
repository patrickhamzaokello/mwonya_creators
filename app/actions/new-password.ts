'use server'
import * as z from 'zod';
import { NewPasswordSchema } from '@/lib/schemas';
import { getDeletePasswordResetTokenbyID, getPasswordResetTokenByToken, postUpdatePassword } from '@/data-layer/password-reset-token';
import { getUserByEmail } from '@/data-layer/user';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null,
) => {
    // if no token, return error
    if (!token) {
        return { error: "Token is required" };
    }

    // validate fields
    const validatedFields = NewPasswordSchema.safeParse(values);

    // if fields are not valid, return error
    if (!validatedFields.success) {
        return { error: "Invalid Fields" };
    }

    // extract password
    const { password } = validatedFields.data;

    // token validation
    const existingToken = await getPasswordResetTokenByToken(token);

    console.log(existingToken)

    // if token not found, return error
    if (!existingToken) {
        return { error: "Invalid Token" };
    }

    const now = Date.now()
    const expiresAt = Number(existingToken.expires) // Convert to number if it's stored as a string

    // Add a 5-minute buffer to account for potential clock discrepancies
    const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    console.log(now, expiresAt, bufferTime)
    if (now > expiresAt + bufferTime) {
        return { error: "Token has expired" }
    }


    // check exisiting user
    const existingUser = await getUserByEmail(existingToken.email);

    // if user not found, return error
    if (!existingUser) {
        return { error: "Email not found" };
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update db
    await postUpdatePassword(existingUser.id, hashedPassword, existingToken.email);

    await getDeletePasswordResetTokenbyID(existingToken.id);

    // return success message
    return { success: "Password updated successfully" }
}