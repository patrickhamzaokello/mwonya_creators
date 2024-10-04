import { prisma } from "@/lib/prisma";

// get artist for the label
export const getArtistsForaLabelbyLabelID = async (recordlableID: string) => {
    try {
        const artists = await prisma.artist.findMany({
            where: { labelId: recordlableID } 
        });

        return artists;
    } catch {
        return null;
    }
}

// return artist profile where userId is matching
export const getArtistProfileByUserId = async (userId: string) => {
    try {
        const artistProfile = await prisma.artist.findFirst({
            where: { name: userId }
        });

        return artistProfile;
    } catch {
        return null;
    }
}

// check if artist name exists
export const getArtistProfileByName = async (artist_name: string) => {
    try {
        const artistProfile = await prisma.artist.findFirst({
            where: { name: artist_name }
        });

        return artistProfile;
    } catch {
        return null;
    }
}


// create new artist
export const CreateArtistProfile = async (name: string, biography: string| undefined, isIndependent:boolean | undefined, profileImage:string, coverImage:string, labelId:string | undefined) => {
    try {
        const artistProfile = await prisma.artist.create({
            data: {
                name,
                biography,
                isIndependent,
                profileImage,
                coverImage,
                labelId
            }
        });

        return artistProfile;
    } catch(error) {
        console.log({error})
        return null;
    }
}



