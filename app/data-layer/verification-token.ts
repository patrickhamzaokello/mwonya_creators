import axiosInstance from "@/lib/axiosInstance";

export const getVerificationTokenByToken = async (
    token: string
) => {
    // Get Verification Token
    try {
        const verificationToken = await axiosInstance.post('getVerificationToken.php', { token });

        if (verificationToken.status === 200) {
            const { status, data } = verificationToken.data
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching verification token:', error);
        return null;
    }
}

export const getVerificationTokenByEmail = async (
    email: string
) => {
    // Get Email Verification 
    try {
        const verificationToken = await axiosInstance.post('getVerificationToken.php', { email });

        if (verificationToken.status === 200) {
            const { status, data } = verificationToken.data
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching verification token:', error);
        return null;
    }
}


export const getDeleteExpiredTokens = async () => {
    try {
        const verificationToken = await axiosInstance.post('deleteExpiredTokens.php', { current_date: new Date() });
    } catch (error) {
        console.error('Error deleting expired token:', error);
        return null;
    }
}

export const getDeleteTokenbyID = async (id: string) => {
    try {
        const verificationToken = await axiosInstance.post('deleteTokenbyID.php', { id });
    } catch (error) {
        console.error('Error deleting token:', error);
        return null;
    }
}

export const updateUserEmailVerfied = async(user_id: string, email: string, emailVerifiedDate: Date) => {
    try {
        const updateEmailVerifiedDate = await axiosInstance.post('updateEmailVerified.php', {user_id, email, emailVerifiedDate});
    }catch (error) {
        console.error('Error updating email', error);
        return null;
    }
}

export const CreateVerificationToken = async (email: string, token: string, expires: Date) => {
    try {
        const create_token = await axiosInstance.post('createVerificationToken.php', { email, token, expires });

        console.log(create_token)

        if (create_token.status === 200) {
            const { status, message } = create_token.data.data
            return message;
        }
        return null;
    } catch (error) {
        console.error('Error creating verification token:', error);
        return null;
    }
}