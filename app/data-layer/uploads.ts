import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';

export const getUploadMedias = async () => {
    try {
        const uploads = await prisma.mediaUpload.findMany({
            include: {
                mediaDescriptions: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });


        return uploads;

    } catch (error) {
        console.error('Error fetching uploads:', error); // Log the error
        return null;
    }
}