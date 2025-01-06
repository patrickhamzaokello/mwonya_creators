'use server'

import { uploadFileToS3 } from '@/lib/s3Upload'


export async function createTrack(formData: FormData) {
  const albumId = formData.get('albumId') as string
  const title = formData.get('title') as string
  const artist = formData.get('artist') as string
  const albumTitle = formData.get('albumTitle') as string
  const genre = parseInt(formData.get('genre') as string)
  const duration = parseInt(formData.get('duration') as string)
  const exclusive = parseInt(formData.get('exclusive') as string)
  const tag = formData.get('tag') as string
  const producer = formData.get('producer') as string
  const songwriter = formData.get('songwriter') as string
  const labels = formData.get('labels') as string
  const description = formData.get('description') as string
  const releaseDate = new Date(formData.get('releaseDate') as string)
  const AESCode = formData.get('AESCode') as string
  const trackFile = formData.get('trackFile') as File
  const coverArtFile = formData.get('coverArtFile') as File

  try {
    // Create track in database with pending status
    // const track = await prisma.track.create({
    //   data: {
    //     albumId,
    //     title,
    //     artist,
    //     albumTitle,
    //     genre,
    //     duration,
    //     exclusive,
    //     tag,
    //     producer,
    //     songwriter,
    //     labels,
    //     description,
    //     releaseDate,
    //     AESCode,
    //     status: 'PENDING',
    //   },
    // })

    // // Start asynchronous upload process for both track and cover art
    // Promise.all([
    //   uploadFileToS3(track.id, trackFile, 'track'),
    //   uploadFileToS3(track.id, coverArtFile, 'coverArt')
    // ]).catch(console.error)

    // return { success: true, trackId: track.id }
    return {success: true, trackId: 'john'}
  } catch (error) {
    console.error('Error creating track:', error)
    return { success: false, error: 'Failed to create track' }
  }
}

