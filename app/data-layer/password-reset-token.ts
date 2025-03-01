import axiosInstance from "@/lib/axiosInstance";
// token functionality
export const getPasswordResetTokenByToken = async (token: string) => {
   
    try {
        const passwordResetToken = await axiosInstance.post('getPasswordResetToken.php', { token });

        if (passwordResetToken.status === 200) {
            const { status, data } = passwordResetToken.data
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching verification token:', error);
        return null;
    }
}

// Token Email functionality (match emails)
export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await axiosInstance.post('getPasswordResetToken.php', { email });

        if (passwordResetToken.status === 200) {
            const { status, data } = passwordResetToken.data
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching verification token:', error);
        return null;
    }
}

export const getDeletePasswordResetTokenbyID = async (id: string) => {
    try {
        const verificationToken = await axiosInstance.post('deletePasswordResetTokenbyID.php', { id });
    } catch (error) {
        console.error('Error deleting token:', error);
        return null;
    }
}


export const postUpdatePassword = async (user_id: string, password: string, user_email: string) => {
    try {       
        const update_password = await axiosInstance.post('updateCreatorPassword.php', { user_id, password,user_email });

        if (update_password.status === 200) {
            const { status, message } = update_password.data.data
            return message;
        }
        return null;
    } catch (error) {
        console.error('Error updating password:', error);   
        return null;
    }
}

export const CreatePasswordResetToken = async (email: string, token: string, expires: number) => {
    try {
        const create_token = await axiosInstance.post('createPasswordResetToken.php', { email, token, expires });

        if (create_token.status === 200) {
            const { status, message } = create_token.data.data
            return message;
        }
        return null;
    } catch (error) {
        console.error('Error creating password reset token:', error);
        return null;
    }
}