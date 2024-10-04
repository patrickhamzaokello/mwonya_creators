// Actions must be use server
"use server"
import * as z from "zod";
import { LoginSchema } from "@/lib/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { comparePassword, getUserByEmail } from "@/data-layer/user";
import { sendVerificationEmail } from "@/lib/mail";


export const login = async (values: z.infer<typeof LoginSchema>) => {
    // Validate fields
    const validatedFields = LoginSchema.safeParse(values);

    // If fields are not valid
    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }
    // If fields are valid
    const { email, password } = validatedFields.data;
    const exisitingUser = await getUserByEmail(email)

    if (!exisitingUser) {
        return { error: "User with this email does not exist" };

    }

    if (!exisitingUser.email || !exisitingUser.password) {
        return { error: "Email / Password does not exist" };

    }

    const matchingPassword = await comparePassword(password, exisitingUser.password);
    if (!matchingPassword) {
        return { error: "Incorrect Password" };
    }


    if (!exisitingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(exisitingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );
        return { success: "Confirmation email sent!" , message_type:"verify_email" }
    }


    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        return { success: "Logged in!" }

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error;
    }
};