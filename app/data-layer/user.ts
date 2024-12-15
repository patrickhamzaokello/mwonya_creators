import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import axiosInstance from "@/lib/axiosInstance";
// Get Email
export const getUserByEmail = async (email:string) => {
   
    try {
        const response = await axiosInstance.post('getMwonyaCreator.php', { email });

        if (response.status === 200) {
            const {status, data} = response.data
            return data; 
        }
        return null;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}


// name, email, phone_number, hashedPassword, 'artist'
export const registerMwonyaCreator = async (name:string, email: string, phone_number: string, hashedPassword: string,  creator_role: string) => {
   
    try {
        const response = await axiosInstance.post('registerMwonyaCreator.php', { username: name, email, phone_number, password: hashedPassword, creator_role });

        if (response.status === 200) {
            const {status, data} = response.data
            return data; 
        }
        return null;
    } catch (error) {
        console.error('Error Saving user details:', error);
        return null;
    }
}

export const comparePassword = async (password: string, hash: string) => {
    try {
        // Use bcrypt or a similar library to compare hashed passwords
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch {
        return false;
    }
}

// Get User Id
export const getUserById = async (id:string) => {
    try {
        const response = await axiosInstance.post('getMwonyaCreator.php', { user_id: id });

        if (response.status === 200) {
            const {status, data} = response.data
            return data; 
        }
        return null;
    } catch (error) {
        console.error('Error fetching user by id:', error);
        return null;
    }
}

export const updateUserProfile = async (userId: string, data: any) => {
    try {
        const updatedArtistProfile = await prisma.user.update({
            where: { id: userId },
            data: data
        });

        return updatedArtistProfile;
    } catch (error) {
        return null;
    }
}