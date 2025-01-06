'use server'

import { uploadFileToS3 } from '@/lib/s3Upload'
import { uploadSingleTrack } from '@/data-layer/artist'
import { v4 as uuidv4 } from 'uuid';

function generateContentId(contentType: string): string {
  // Check content type and assign the appropriate prefix
  const prefix = contentType === "track" ? "mw_trk" : "mw_alb";
  
  const uniqueId = uuidv4(); // Generate a unique identifier
  return `${prefix}${uniqueId}`;
}


export async function createTrack(formData: FormData) {
  const albumId = formData.get('albumId') as string
  const title = formData.get('title') as string
  const artistId = formData.get('artistId') as string
  const albumTitle = formData.get('albumTitle') as string
  const genre = parseInt(formData.get('genre') as string)
  const duration = parseInt(formData.get('duration') as string)
  const exclusive = parseInt(formData.get('exclusive') as string)
  const tag = formData.get('tag') as string
  const producer = formData.get('producer') as string
  const songwriter = formData.get('songwriter') as string
  const labels = formData.get('labels') as string
  const description = formData.get('description') as string
  const rawReleaseDate  = new Date(formData.get('releaseDate') as string)
  const AESCode = formData.get('AESCode') as string
  const trackFile = formData.get('trackFile') as File
  const coverArtFile = formData.get('coverArtFile') as File

  console.log(FormData)

  try {
    
    const newAlbumId = generateContentId('container');
    const newTrackReferenceID = generateContentId('track')

    const formattedReleaseDate = rawReleaseDate.toISOString().split('T')[0];

    const trackDetails: SingleTrackDetails = {
      album_id: newAlbumId,
      track_reference: newTrackReferenceID,
      title: title,
      artist: artistId,
      album_title: title,
      genre: genre,
      duration: 210,
      exclusive: 1,
      tag: tag,
      producer: producer,
      songwriter: songwriter,
      labels: labels,
      description: description,
      releaseDate: formattedReleaseDate,
      AES_code: AESCode
  };

    const data = await uploadSingleTrack(trackDetails)
    console.log(data)

    if(!data.success){
      return { success: false, trackId: newAlbumId}
    }

    console.log(newTrackReferenceID)
    console.log(newAlbumId)

    // Start asynchronous upload process for both track and cover art
    Promise.all([
      uploadFileToS3(newTrackReferenceID, trackFile, 'track'),
      uploadFileToS3(newAlbumId, coverArtFile, 'coverArt')
    ]).catch(console.error)

    return { success: true, trackId: newAlbumId}

  } catch (error) {
    console.error('Error creating track:', error)
    return { success: false, error: 'Failed to create track' }
  }
}

