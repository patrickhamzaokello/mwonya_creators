"use server"
import { auth } from '@/auth';
import { saveUploadDetails, saveTrackDetails } from '@/data-layer/artist';

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
    "video/mp4", "video/webm", "audio/mp3", "audio/aac", "audio/vnd.dlna.adts", "audio/x-m4a", "audio/wav", "audio/m4a", "audio/mpeg"
];

const maxFileSize = 10 * 1024 * 1024; // 10MB

const generateFilename = (fileType: string, bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    const randomString = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
    const extension = fileType.split('/')[1];
    return `${randomString}.${extension}`;
};

export async function getTrackSignedURL(fileType: string, fileSize: number, checksum: string, mw_upload_type: string) {
    const session = await auth();
    if (!session) {
        return { failure: "Not authenticate",message: "Invalid User Details" }
    }

    if (!acceptedFileTypes.includes(fileType)) {
        return { failure: "Invalid file type",message: "Invalid File Type, only Audio files allowed" }
    }

    if (fileSize > maxFileSize) {
        return { failure: "File size too large", message: "The File is too large - allowed max. size is 10Mb" }
    }

    const file_genName = generateFilename(fileType);

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${mw_upload_type}s/${file_genName}`,
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

    const media_details: MediaUploadDetails = {
        user_id: session.user.id ?? "null",
        upload_type: mw_upload_type,
        file_path: url.split("?")[0],
        file_name: file_genName,
        file_hash: checksum,
        file_size: fileSize,
        file_format: fileType,
        metadata: JSON.stringify({ file_genName, fileSize, mw_upload_type }),
        is_active: 0
    }

    const mediaResult = await saveUploadDetails(media_details);


    if (!mediaResult) {
        return { failure: "Failed to save upload details", message: "Invalid response" }
    }

    if (!mediaResult.success) {
        return { failure: "Failed to Save upload Details", message: mediaResult.message }
    }

    return { success: { signedURL: url, upload_id: mediaResult.upload_id } }

}


export async function createTrackDetails({ reference_id, title, artist, album, genre, upload_id, duration, tag, metadata, releasedate }: UploadTrackDetails) {
    const session = await auth();
    if (!session) {
        return { failure: "Not authenticate" }
    }

    const trackDetails: UploadTrackDetails = {
        reference_id,
        title,
        artist,
        album,
        genre,
        upload_id,
        duration,
        tag,
        metadata,
        releasedate
    }


    const track_results = await saveTrackDetails(trackDetails);

    if (!track_results) {
        return { failure: "Failed to save track details" }
    }

    if (!track_results.success) {
        return { failure: "Server failure, Check Track Details" }
    }

    return { success: { track_reference_id: track_results.reference_id, message: track_results.message } }

}