import { getDeleteTokenbyID, getVerificationTokenByEmail, CreateVerificationToken } from '@/data-layer/verification-token';
import { v4 as uuidv4 } from 'uuid';
import { getDeletePasswordResetTokenbyID, getPasswordResetTokenByEmail, CreatePasswordResetToken } from '@/data-layer/password-reset-token';


export const generateVerificationToken = async (email: string) => {
    // Generate Verification Token
    const token = uuidv4();
    // expires token in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    // check if we have an exisiting token sent to his email, if it is, remove it
    const existingToken = await getVerificationTokenByEmail(email);
    // delete function
    if(existingToken) {
        await getDeleteTokenbyID(existingToken.id)
    }
    // create new token 
    const verificationToken = await CreateVerificationToken(email, token, expires);
    
    return verificationToken;

}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    // expires token in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    // check if we have an exisiting token sent to his email, if it is, remove it
    const existingToken = await getPasswordResetTokenByEmail(email);
    // delete function
    if (existingToken) {
        await getDeletePasswordResetTokenbyID(existingToken.id)
    }
    // create new token
    const passwordResetToken = await CreatePasswordResetToken(email, token, expires)

    return passwordResetToken;
}