import ResetPassword from "@/components/email/reset-password";
import Plunk from '@plunk/node';
import LinkEmail from "@/components/email/verify-email";
import { render } from "@react-email/render";

const email_secret = process.env.EMAIL_SERVER_PASSWORD;
const plunk  = new Plunk(email_secret??"undefined");
const base_url = `https://creator.mwonya.com/`;
// Send a verification email to the user
export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `https://creator.mwonya.com/auth/new-verification?token=${token}`;
   

    const emailHtml = await render(LinkEmail({token}));

    await plunk.emails.send({
        from: "info@mwonya.com",
        to: email,
        subject: "Confirm your email on Mwonya",
        body: emailHtml,
    })


    // plunk.contacts.create({
    //     email: email,
    //     audience_id: 'ed288a7a-23ef-4f32-a2f1-3dc887da7a1c'
    // })

    
}
// Send password reset token to user
export const sendPasswordResetEmail = async (
    email: string,
    token: string,
) => {
    const resetLink = `https://creator.mwonya.com/auth/new-password?token=${token}`;
    const emailHtml = await render(ResetPassword({token}))


    await plunk.emails.send({
        from: "info@mwonya.com",
        to: email,
        subject: "Reset your password",
        body:emailHtml,
    })

}