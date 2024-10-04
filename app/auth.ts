import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { getUserByEmail } from "@/data-layer/user"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { LoginSchema } from "@/lib/schemas"
import { User } from "@auth/core/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Github(
            {
                allowDangerousEmailAccountLinking: true
            }
        ),
        Google({
            allowDangerousEmailAccountLinking: true
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, request): Promise<User | null> {
                try {
                    // Validate the credentials given by the user
                    const validatedFields = await LoginSchema.safeParse(credentials)
                    if (!validatedFields.success) {
                        return null;
                    }

                    const { email, password } = validatedFields.data;
                    const user = await getUserByEmail(email);

                    if (!user || !user.password) {
                        return null;
                    }
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) {
                        // Make sure the returned user object matches the User type
                        return {
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          image: user.image,
                          role: user.role,
                        };
                      }
                    return null;
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    return null;
                }
            }


        })
    ],
});