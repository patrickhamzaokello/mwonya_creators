"use server";
import { fetchUserArtists } from "@/data-layer/artist";
import { auth } from '@/auth';

export const getArtistsForUser = async () => {
    const session = await auth();
    const session_userID = session?.user.id;
    try {
        const userArtists = await fetchUserArtists(session_userID??"");

        if (userArtists.fetchedArtists) {

            const artists = userArtists.fetchedArtists;
            const formattedArtists = artists.map(artist => ({
                id: artist.id,
                name: artist.name,
                image: artist.profileImage?.fileUrl || '', 
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