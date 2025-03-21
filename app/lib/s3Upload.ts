"use server"
import { auth } from '@/auth';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { updateTrack_File_Album_cover } from '@/data-layer/artist';

//using edge function to generate file names
const generateFilename = (fileType: string, bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    const randomString = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
    const extension = fileType.split('/')[1];
    return `${randomString}.${extension}`;
}

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


export async function uploadFileToS3(trackId: string, file: File, fileType: 'track' | 'coverArt') {

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

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: generateFilename(file.type),
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

    await updateTrack_File_Album_cover(trackId,fileType, signedURL.split("?")[0], "uploaded")


  } catch (error) {

    await updateTrack_File_Album_cover(trackId,fileType, null, "failed")
  }
}

