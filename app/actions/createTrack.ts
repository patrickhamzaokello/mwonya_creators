'use server'

import { uploadFileToS3 } from '@/lib/s3Upload'
import { uploadSingleTrack } from '@/data-layer/artist'
import { v4 as uuidv4 } from 'uuid';

function generateAlbumId(): string {
    const prefix = "mw_alb";
    const uniqueId = uuidv4(); // Generate a unique identifier
    return `${prefix}${uniqueId}`;
}


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
    
    const newAlbumId = generateAlbumId();
    console.log(newAlbumId);

    const trackDetails: SingleTrackDetails = {
      album_id: newAlbumId,
      title: title,
      artist: artist,
      album_title: title,
      artworkPath: "pending",
      genre: genre,
      duration: 210,
      path: "pending",
      exclusive: 1,
      tag: tag,
      producer: producer,
      songwriter: songwriter,
      labels: labels,
      description: description,
      releaseDate: "2025-01-01",
      AES_code: AESCode
  };

    const data = await uploadSingleTrack(trackDetails)

    if(!data.success){
      return { success: false, trackId: newAlbumId}
    }

    // Start asynchronous upload process for both track and cover art
    Promise.all([
      uploadFileToS3(newAlbumId, trackFile, 'track'),
      uploadFileToS3(newAlbumId, coverArtFile, 'coverArt')
    ]).catch(console.error)

    return { success: true, trackId: newAlbumId}

  } catch (error) {
    console.error('Error creating track:', error)
    return { success: false, error: 'Failed to create track' }
  }
}

