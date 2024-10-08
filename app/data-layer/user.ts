import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

// Get Email
export const getUserByEmail = async (email:string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email }});
        return user;
    } catch {
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
        const user = await prisma.user.findUnique({ 
            where: { id: id }
        });
        return user;
    } catch {
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