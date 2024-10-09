import { prisma } from "@/lib/prisma";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { MediaUploadType } from "@prisma/client";

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
            where: { userId: userId }
        });

        return artistProfile;
    } catch {
        return null;
    }
}

export const fetchUserArtists = async (userId: string) => {
    try {
        const artists = await prisma.artist.findMany({
            where: {
                userId: userId, // Assuming you have a userId field in your Artist model
            },
            select: {
                id: true,
                name: true,
                genre: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                profileImage: {
                    select: {
                        fileUrl: true,
                    },
                },
                coverImage: {
                    select: {
                        fileUrl: true,
                    },
                },
            },
        });

        return {
            status: "success",
            fetchedArtists: artists,
        };
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
};

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

// Check if any artist associated with the given user ID is independent
export const isAnyArtistIndependentByUserId = async (currentUserID: string | undefined | null) => {
    try {
        const independentArtists = await prisma.artist.findMany({
            where: {
                userId: currentUserID,
                isIndependent: true
            }
        });

        return independentArtists.length > 0;
    } catch {
        return false;
    }
}

// create new artist
export const CreateArtistProfile = async (name: string, genred: string, biography: string | undefined, isIndependent: boolean | undefined, labelId: string, artistAgreetoTermsConditions: boolean | undefined, artistAgreetoContentUploadPolicy: boolean | undefined, currentUserID: string ) => {
    try {
        const artistProfile = await prisma.artist.create({
            data: {
                name,
                biography,
                AgreeToContentPolicy: artistAgreetoContentUploadPolicy,
                AgreeToTermsPolicy: artistAgreetoTermsConditions,
                isIndependent,
                genre:{
                    connect: {
                        id: genred
                    }
                },
                user : {
                    connect: {
                        id: currentUserID,
                    }
                },
                ...(isIndependent ? {} : {
                    label: {
                        connect: {
                            id: labelId
                        }
                    }
                })
                
            }
        });

        return artistProfile;
    } catch (error) {
        console.log(error)
        return null;
    }
}

// Update the artist table given artist id and profile id
export const updateArtistProfileImage = async (artistId: string, mediaId: string, imageType: 'profile' | 'cover') => {
    try {
        const dataToUpdate = imageType === 'profile' 
            ? { profileImage: { connect: { id: mediaId } } } 
            : { coverImage: { connect: { id: mediaId } } };

        const updatedArtist = await prisma.artist.update({
            where: { id: artistId },
            data: dataToUpdate
        });

        return updatedArtist;
    } catch (error) {
        console.error("Error updating artist profile image:", error);
        return null;
    }
}

// save artist profile upload details
export const SaveArtistProfileUpload = async (signedURL: string, fileType: string, currentUserID: string) => {
    try {
        const createArtistMediaUpload = await prisma.mediaUpload.create({
            data: {
                fileUrl: signedURL,
                type: fileType as MediaUploadType,
                userId: currentUserID,
            }
        })

        return createArtistMediaUpload;
    } catch (error) {
        return null;
    }
}


