"use server"
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

export const socialBTN = async (provider: 'google' | 'github') => {
    try {
        await signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT });
    } catch (error) {
        throw error;
    }
};