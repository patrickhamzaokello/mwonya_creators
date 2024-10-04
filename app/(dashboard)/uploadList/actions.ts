"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
    },
})


export async function deleteMedia(mediaDescriptionID: string) {

    const session = await auth()
    if (!session) {
        return { success: false, message: "Not authenticated" };
    }

    // check if mediaDescription exists
    const mediaDescription = await prisma.mediaDescription.findUnique({
        where: { id: mediaDescriptionID },
        include: { media: true }
    })

    if (!mediaDescription) {
        return { success: false, message: "Media description not found" };
    }

    // check if mediaDescription.mediaId  exist with mediaUpload if and if user owns the mediaUpload
    const mediaUpload = await prisma.mediaUpload.findUnique({
        where: { id: mediaDescription.mediaId },
        include: { user: true }
    })

    if (!mediaUpload) {
        return { success: false, message: "Associated media upload not found" };
    }

    // only users who uploaded the media can delete it
    if (mediaUpload.user.id !== session.user.id) {
        return { success: false, message: "You don't have permission to delete this media" };
    }

    try {
        // Delete the associated media first
        if (mediaDescription.media) {
            // Delete the media upload
            await prisma.mediaUpload.delete({
                where: { id: mediaUpload.id }
            })
        }

        // delete from s3
        const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: mediaUpload.fileUrl.split("/").pop(),
        })

        await s3.send(deleteObjectCommand)

        revalidatePath('/uploadList');
        return { success: true, message: "Media deleted successfully" };
    } catch (error) {
        return { success: false, message: "Failed to delete media" + error };
    }
}