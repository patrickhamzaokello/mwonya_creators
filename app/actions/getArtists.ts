"use server";
import { fetchUserArtists,fetchArtistsDiscover } from "@/data-layer/artist";

import { auth } from '@/auth';


export const getArtistDiscovery = async (artist_id: string) => {
    try {
        const userArtists = await fetchArtistsDiscover(artist_id);

        console.log(userArtists)

        if (userArtists.artistDiscovery) {

            const artist_content = userArtists.artistDiscovery;
           
            
            return { status: "success", message: "Retrived artist Successfully",artist_content};
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
    try {
        const userArtists = await fetchUserArtists(session_userID??"");

        if (userArtists.fetchedArtists) {

            const artists = userArtists.fetchedArtists;
            const formattedArtists:TArtist[] = artists.map((artist: { id: any; name: any; genre: { id: any; name: any; }; profileImage: { fileUrl: any; }; coverImage: { fileUrl: any; }; verified: any; biography: any; }) => ({
                id: artist.id,
                name: artist.name,
                genreID: artist.genre?.id || '',
                genreName: artist.genre?.name || '', 
                profileImage: artist.profileImage?.fileUrl || '', 
                coverImage: artist.coverImage?.fileUrl || '',
                followers: "12k",
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