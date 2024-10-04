import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { getUserByEmail } from "@/data-layer/user"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { LoginSchema } from "@/lib/schemas"
 
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
            async authorize(credentials) {
              try {
                // Validate the credentials given by the user
                const validatedFields = await LoginSchema.safeParse(credentials)
                let user = null
                if (validatedFields.success) {
                  const { email, password } = validatedFields.data;
      
                  const user = await getUserByEmail(email);
      
                  if (!user || !user.password) throw new Error("User not found.");
      
                  // check if passwords match
                  const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password
                  );
                  // if the passwords match, return the user
                  if (passwordsMatch) return user;
                }
                return user;
              } catch (error) {
                if (error instanceof ZodError) {
                  // Return `null` to indicate that the credentials are invalid
                  return null
                }
              }
            }
      
      
          })
    ],
});