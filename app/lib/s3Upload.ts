import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const prisma = new PrismaClient()

export async function uploadFileToS3(trackId: number, file: File, fileType: 'track' | 'coverArt') {
  const fileBuffer = await file.arrayBuffer()
  const fileName = `${trackId}-${fileType}-${file.name}`

  try {
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
    }

    await s3Client.send(new PutObjectCommand(uploadParams))

    const awsUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`

    // Update track in database
    if (fileType === 'track') {
      await prisma.track.update({
        where: { id: trackId },
        data: {
          awsUrl,
          status: 'UPLOADED',
        },
      })
    } else if (fileType === 'coverArt') {
      await prisma.track.update({
        where: { id: trackId },
        data: {
          coverArtUrl: awsUrl,
        },
      })
    }

    console.log(`${fileType} for track ${trackId} uploaded successfully`)
  } catch (error) {
    console.error(`Error uploading ${fileType} for track ${trackId}:`, error)

    if (fileType === 'track') {
      // Update track status to FAILED only if the track file upload fails
      await prisma.track.update({
        where: { id: trackId },
        data: {
          status: 'FAILED',
        },
      })
    }
  }
}

