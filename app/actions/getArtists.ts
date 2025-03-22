"use server";
import { fetchUserArtists, fetchArtistsDiscover, fetchContentDetails, searchArtistName } from "@/data-layer/artist";
import { auth } from '@/auth';
import { ProfileArtist, TsearchArtist } from "@/types/artist";





export async function updateArtistProfile(data: Partial<ProfileArtist>): Promise<{ success: boolean; message: string }> {
  // In a real application, you would update the database here

  // Simulate a delay and return success
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true, message: "Profile updated successfully" }
}





// This is a mock database. In a real application, you would query your actual database here.
const mockArtists: TsearchArtist[] = [
    { id: "1", name: "The Beatles", imageUrl: "/album_placeholder.svg?height=40&width=40" },
    { id: "2", name: "Queen", imageUrl: "/album_placeholder.svg?height=40&width=40" },
    { id: "3", name: "Pink Floyd", imageUrl: "/album_placeholder.svg?height=40&width=40" },
    { id: "4", name: "Led Zeppelin", imageUrl: "/album_placeholder.svg?height=40&width=40" },
    { id: "5", name: "Radiohead", imageUrl: "/album_placeholder.svg?height=40&width=40" },
]

export async function searchArtistsName(query: string): Promise<TsearchArtist[]> {
    // Simulate database query delay
    const artist_result = await searchArtistName(query.toLowerCase());


    if (artist_result.artist_data) {

        const artist_content:TsearchArtist[] = artist_result.artist_data;

        return artist_content;
    } else {
        return [];
    }

}


export const getArtistDiscovery = async (artist_id: string) => {
    try {
        const userArtists = await fetchArtistsDiscover(artist_id);


        if (userArtists.artistDiscovery) {

            const artist_content = userArtists.artistDiscovery;


            return { status: "success", message: "Retrived discovery Successfully", artist_content };
        } else {
            return { status: "error", message: "Failed to get any artist details" };
        }

    } catch (error) {
        return {
            status: "error",
            message: `Error getting artist profile: ${error}`,
        };
    }
}

export const getArtistsForUser = async () => {
    const session = await auth();
    const session_userID = session?.user.id;
    const role = session?.user.role;
    try {
        const userArtists = await fetchUserArtists(session_userID ?? "", role ?? "");

        if (userArtists.fetchedArtists) {

            const artists = userArtists.fetchedArtists;
            const formattedArtists: TArtist[] = artists.map((artist: { id: any; name: any; followers: any; genre: { id: any; name: any; }; profileImage: { fileUrl: any; }; coverImage: { fileUrl: any; }; verified: any; biography: any; }) => ({
                id: artist.id,
                name: artist.name,
                genreID: artist.genre?.id || '',
                genreName: artist.genre?.name || '',
                profileImage: artist.profileImage?.fileUrl || '',
                coverImage: artist.coverImage?.fileUrl || '',
                followers: artist.followers || '0',
                verified: artist.verified || false,
                shortbio: artist.biography || ''
            }));

            return { status: "success", message: "Retrived artist Successfully", formattedArtists };
        } else {
            return { status: "error", message: "Failed to get any artist details" };
        }

    } catch (error) {
        return {
            status: "error",
            message: `Error getting artist profile: ${error}`,
        };
    }
}

export async function publish_content(content_id: string, content_state: number) {


    try {
        const response = await fetch('https://creatorapi.mwonya.com/Requests/endpoints/artist/publishContent.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content_id: content_id, // Assuming 'id' is the album's content ID
              content_state: content_state
            })
          });


          if (!response.ok) {
            throw new Error('Failed to submit release for review');
          }
    
          const data = await response.json();

          return data;
    } catch (error) {
        return {
            status: "error",
            message: `Error submitting release for review: ${error}`,
        };
    }

}

export async function getContentDetails(content_id: string) {

    try {
        const data = await fetchContentDetails(content_id ?? "");
        const content_info = data.content_details;
        if (content_info) {
            return { status: "success", message: "Retrived artist Successfully", content_info };
        } else {
            return { status: "error", message: "Failed to get any artist details" };
        }

    } catch (error) {
        return {
            status: "error",
            message: `Error getting artist profile: ${error}`,
        };
    }


}

