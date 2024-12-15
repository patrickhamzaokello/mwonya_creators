// Actions must be use server
"use server"
import * as z from "zod";
import { RegisterSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail,  registerMwonyaCreator} from "@/data-layer/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    // Validate fields
    const validatedFields = RegisterSchema.safeParse(values);

    // If fields are not valid
    if(!validatedFields.success) {
        return { error: "Invalid fields 😞"};
    }

    // extract validated fields
    const { email, password, phone_number, name } = validatedFields.data;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // confirm email is not taken
    const exisitingUser = await getUserByEmail(email)
        
    // display text if email is taken
    if (exisitingUser) {
        return { error: "Email already taken 😞"}
    }
    // succes code
    await registerMwonyaCreator(name, email, phone_number, hashedPassword, 'artist');
    // generate verification token
    const verificationToken = await generateVerificationToken(email);

    console.log(verificationToken)

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );

    // If fields are valid
    return { success: "Confirmation email sent!"}
};