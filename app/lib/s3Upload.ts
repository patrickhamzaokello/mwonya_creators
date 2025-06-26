"use server"
import { auth } from '@/auth';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { updateTrack_File_Album_cover, saveUploadDetails } from '@/data-layer/artist';
import { generateFilename } from '@/utils/filenameUtil';


const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
    },
})

const acceptedFileTypes = ["image/jpeg", "image/JPG", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "audio/mp3", "audio/wav", "audio/m4a", "audio/mpeg"]

const maxFileSize = 300 * 1024 * 1024 // 300MB


const computeSHA256 = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}


export async function uploadFileToS3(trackId: string, file: File, fileType: 'track' | 'coverArt', aws_folder_prefix: string = "images/albums/") {

  try {

    const checksum = await computeSHA256(file)

    const session = await auth();
    if (!session) {
        return { failure: "Not authenticate" }
    }

    if (!acceptedFileTypes.includes(file.type)) {
        return { failure: "Invalid file type" }
    }

    if (file.size > maxFileSize) {
        return { failure: "File size too large" }
    }

    const file_genName = generateFilename(file.type);
    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${aws_folder_prefix}${file_genName}`,
        ContentType: file.type,
        ContentLength: file.size,
        ChecksumSHA256: checksum,
        Metadata: {
            userId: session.user.id ?? "null",
        }
    })
    const signedURL = await getSignedUrl(s3 as any, putObjectCommand as any, {
        expiresIn: 300, // link available for only 5 mins 60 * 5
    });


    await fetch(signedURL, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    })

        const media_details: MediaUploadDetails = {
            user_id: session.user.id ?? "null",
            upload_type: fileType,
            file_path: signedURL.split("?")[0],
            file_name: file_genName,
            file_hash: checksum,
            file_size: file.size,
            file_format: file.type,
            metadata: JSON.stringify({ file_genName, fileType }),
            is_active: 0
    }
    
        const mediaResult = await saveUploadDetails(media_details);
    
    
        if (!mediaResult) {
            return { failure: "Failed to save upload details", message: "Invalid response" }
        }
    
        if (!mediaResult.success) {
            return { failure: "Failed to Save upload Details", message: mediaResult.message }
        }


    await updateTrack_File_Album_cover(trackId,fileType, mediaResult.upload_id, "uploaded")


  } catch (error) {

    await updateTrack_File_Album_cover(trackId,fileType, null, "failed")
  }
}

