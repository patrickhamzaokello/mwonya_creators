"use server"

import { revalidatePath } from "next/cache"

// Types
export type ArtistData = {
  id: string,
  name: string,
  email: string,
  phone: string,
  meta_data: string,
  RecordLable: string,
  isIndependent: number,
  tag: string,
  circle_cost: string,
  circle_cost_maximum: string,
  circle_duration: number,
  genre: string,
  genre_id?: number,
  bio: string,
  releaseDate: string,
  profile_image_id?: number,
  cover_image_id?: number,
  profilephoto: string,
  cover_image: string,
  facebookurl: string,
  twitterurl: string,
  instagramurl: string,
  youtubeurl: string,
}



/**
 * Upload an image to AWS S3
 * @param formData FormData containing the file to upload
 * @returns The URL of the uploaded file
 */
export async function uploadImageToS3(formData: FormData): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    // Get the file from the form data
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, url: "", error: "No file provided" }
    }

    // In a real implementation, you would use the AWS SDK to upload the file
    // For this example, we'll simulate a successful upload after a delay

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a fake AWS S3 path
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = file.name.replace(/\s+/g, "-").toLowerCase()
    const awsPath = `https://mwonya-kasfa-assets-store.s3.us-east-1.amazonaws.com/images/artist/${randomString}${timestamp}-${fileName}`

    return { success: true, url: awsPath }
  } catch (error) {
    console.error("Error uploading image to S3:", error)
    return {
      success: false,
      url: "",
      error: error instanceof Error ? error.message : "Unknown error occurred during upload",
    }
  }
}

/**
 * Update artist profile data
 * @param artistData The artist data to update
 * @returns Success status and updated artist data
 */
export async function updateArtistProfile(
  artistData: Partial<ArtistData>
): Promise<{ success: boolean; data?: Partial<ArtistData>; error?: string }> {
  try {
    // Validate required fields
    // if (!artistData.id || !artistData.name || !artistData.email) {
    //   return { success: false, error: "Missing required fields" }
    // }

    console.log(artistData);

    // In a real implementation, you would update the database
    // For this example, we'll update our in-memory database

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))


    // Revalidate the artist profile page to reflect the changes
    revalidatePath("/artist_profile")

    return { success: true, data: artistData }
  } catch (error) {
    console.error("Error updating artist profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during update",
    }
  }
}

/**
 * Get artist profile data
 * @param artistId The ID of the artist to retrieve
 * @returns The artist data
 */
export async function getArtistProfile(
  artistId: string,
): Promise<{ success: boolean; data?: ArtistData; error?: string }> {
  try {
    const response = await fetch('https://creatorapi.mwonya.com/Requests/endpoints/artist/artist_profile.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        artistId: artistId, 
      })
    });

    console.log(response)

    if (!response.ok) {
      throw new Error('failed to fetch artist details');
    }

    const artist = await response.json();

    if (!artist) {
      return { success: false, error: "Artist not found" }
    }

    return { success: true, data: artist }
  } catch (error) {
    console.error("Error retrieving artist profile:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during retrieval",
    }
  }
}

/**
 * Delete an artist account
 * @param artistId The ID of the artist to delete
 * @returns Success status
 */
export async function deleteArtistAccount(
  artistId: string,
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real implementation, you would delete from the database
    // For this example, we'll delete from our in-memory database

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))




    // Revalidate relevant paths
    revalidatePath("/dashboard")
    revalidatePath("/artists")

    return { success: true }
  } catch (error) {
    console.error("Error deleting artist account:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during deletion",
    }
  }
}

