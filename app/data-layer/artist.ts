import { prisma } from "@/lib/prisma";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { MediaUploadType } from "@prisma/client";
import axiosInstance from "@/lib/axiosInstance";


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

        const response = await axiosInstance.post('/artist/getUserArtist.php', { user_id: userId });
        const { status, data } = response.data
       
        return {
            status: "success",
            fetchedArtists: data,
        };
    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }

};

export const uploadSingleTrack = async (trackDetails:SingleTrackDetails) => {
   
    try {
        const response = await axiosInstance.post('artist/uploadSingleTrack_Container.php', { trackDetails });
        console.log('jim')
        console.log(response)

        if (response.status === 200) {
            const {status, data} = response.data
            return data; 
        }
        return null;
    } catch (error) {
        console.error('Error Saving user details:', error);
        return null;
    }
} 

export const updateTrack_File_Album_cover = async (referenceId: string, fileType: string, awsUrl: any, upload_status: string) => {
    try {

        const response = await axiosInstance.post('artist/updateTrack_File_Album_cover.php', { referenceId, fileType, awsUrl,upload_status });

        const { status, data } = response.data
        console.log(data)

        return {
            status: "success",
            upload_status: data,
        };
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }

};

export const fetchArtistsDiscover = async (artist_id: string) => {
    try {

        console.log({ artist_id: artist_id })
        const response = await axiosInstance.post('artist/getArtistDiscover.php', { artist_id: artist_id });

        const { status, data } = response.data
        console.log(data)

        return {
            status: "success",
            artistDiscovery: data,
        };
    } catch (error) {
        console.log(artist_id)
        console.log(error)
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }

};

export const fetchContentDetails = async (content_id: string) => {
    try {

        const response = await axiosInstance.post('artist/getContentDetails.php', { content_id: content_id });

        const { status, data } = response.data
        console.log(data)

        return {
            status: "success",
            content_details: data,
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
export const CreateArtistProfile = async (name: string, genred: string, biography: string | undefined, isIndependent: boolean | undefined, labelId: string, artistAgreetoTermsConditions: boolean | undefined, artistAgreetoContentUploadPolicy: boolean | undefined, currentUserID: string) => {
    try {
        const artistProfile = await prisma.artist.create({
            data: {
                name,
                biography,
                AgreeToContentPolicy: artistAgreetoContentUploadPolicy,
                AgreeToTermsPolicy: artistAgreetoTermsConditions,
                isIndependent,
                genre: {
                    connect: {
                        id: genred
                    }
                },
                user: {
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


