"use server";
import { fetchUserArtists,fetchArtistsDiscover ,fetchContentDetails} from "@/data-layer/artist";
import { auth } from '@/auth';


export const getArtistDiscovery = async (artist_id: string) => {
    try {
        const userArtists = await fetchArtistsDiscover(artist_id);


        if (userArtists.artistDiscovery) {

            const artist_content = userArtists.artistDiscovery;

           
            return { status: "success", message: "Retrived discovery Successfully",artist_content};
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
        const userArtists = await fetchUserArtists(session_userID??"", role??"");

        if (userArtists.fetchedArtists) {

            const artists = userArtists.fetchedArtists;
            const formattedArtists:TArtist[] = artists.map((artist: { id: any; name: any; followers: any; genre: { id: any; name: any; }; profileImage: { fileUrl: any; }; coverImage: { fileUrl: any; }; verified: any; biography: any; }) => ({
                id: artist.id,
                name: artist.name,
                genreID: artist.genre?.id || '',
                genreName: artist.genre?.name || '', 
                profileImage: artist.profileImage?.fileUrl || '', 
                coverImage: artist.coverImage?.fileUrl || '',
                followers: artist.followers || '0',
                verified: artist.verified || false,
                shortbio: artist.biography|| ''
            }));
            
            return { status: "success", message: "Retrived artist Successfully",formattedArtists};
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

export async function getContentDetails(content_id: string) {

    try {
        console.log(content_id)
        const data = await fetchContentDetails(content_id??"");
        const content_info = data.content_details;
        console.log(content_info)
        if (content_info) {
            return { status: "success", message: "Retrived artist Successfully", content_info};
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
  
  