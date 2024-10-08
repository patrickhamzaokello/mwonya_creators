"use server"
import { signIn } from "@/auth";

export const socialBTN = async (provider: 'google' | 'github') => {
    try {
        await signIn(provider, { redirectTo: "/studio" });
    } catch (error) {
        throw error;
    }
};