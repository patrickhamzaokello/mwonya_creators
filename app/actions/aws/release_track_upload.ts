"use server"
import { auth } from '@/auth';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"



const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
    },
})


const acceptedFileTypes = [
    "image/jpeg", "image/JPG", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/webm", "audio/mp3", "audio/aac","audio/vnd.dlna.adts", "audio/x-m4a", "audio/wav", "audio/m4a", "audio/mpeg"
];

const maxFileSize = 10 * 1024 * 1024; // 10MB

const generateFilename = (fileType: string, bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    const randomString = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
    const extension = fileType.split('/')[1];
    return `${randomString}.${extension}`;
};

export async function getTrackSignedURL(fileType: string, fileSize: number, checksum: string) {
    const session = await auth();
    if (!session) {
        return { failure: "Not authenticate" }
    }

    if (!acceptedFileTypes.includes(fileType)) {
        return { failure: "Invalid file type" }
    }

    if (fileSize > maxFileSize) {
        return { failure: "File size too large" }
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: generateFilename(fileType),
        ContentType: fileType,
        ContentLength: fileSize,
        ChecksumSHA256: checksum,
        Metadata: {
            userId: session.user.id ?? "null",
        }
    })
    const url = await getSignedUrl(s3 as any, putObjectCommand as any, {
        expiresIn: 300, // link available for only 5 mins 60 * 5
    });

    // const mediaResult = await prisma.mediaUpload.create({
    //     data: {
    //         fileUrl: signedURL.split("?")[0],
    //         type: fileType.startsWith("image") ? "image" : fileType.startsWith("video") ? "video" : "audio",
    //         userId: session.user.id ?? "null",
    //     }
    // })

    // return { success: { url: signedURL, mediaId: mediaResult.id } }

    return { success: { signedURL: url, mediaId: 2 } }

}


export async function createTrackDetails({ content, mediaId }: TMediaUploadDescription) {
    const session = await auth();
    if (!session) {
        return { failure: "Not authenticate" }
    }

    // // make sure mediaId exist and is created by current user
    // const mediaItem = await prisma.mediaUpload.findUnique({
    //     where: {
    //         id: mediaId,
    //         userId: session.user.id,
    //     }
    // })

    // if (!mediaItem) {
    //     return { failure: "Media item not found" }
    // }
    // // create a media description
    // const mediaDescription = await prisma.mediaDescription.create({
    //     data: {
    //         content,
    //         mediaId: mediaItem.id,
    //     }
    // })
    // // link uploaded media to the media description
    // await prisma.mediaUpload.update({
    //     where: {
    //         id: mediaItem.id,
    //     },
    //     data: {
    //         mediaDescriptions: {
    //             connect: { id: mediaDescription.id },
    //         },
    //     },
    // });

}