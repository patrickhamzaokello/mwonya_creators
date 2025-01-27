import axiosInstance from "@/lib/axiosInstance";
import type { Artist } from '@/types/artist';

// return artist profile where userId is matching
export const getArtistProfileByUserId = async (userId: string) => {
    try {
        const response = await axiosInstance.post('/artist/creator_artist_exist.php', { creator_id: userId });
        return response.data;
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
}

export const fetchUserArtists = async (userId: string, userRole: string) => {
    try {
        console.log(userRole, userId)
        const response = await axiosInstance.post('/artist/getUserArtist.php', { user_id: userId, userRole: userRole });
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


export const saveTrackDetails = async (trackDetails: UploadTrackDetails) => {
    try {
        const response = await axiosInstance.post('artist/saveTrackDetails.php', { trackDetails: trackDetails });
        if (response.status === 200) {
            const { status, data } = response.data
            return data;
        }
        return null;
    } catch (error) {
        console.log('Error Saving user details:', error);
        return null;
    }
}


export const saveUploadDetails = async (mediaUpload_details: MediaUploadDetails) => {
    try {
        const response = await axiosInstance.post('artist/saveMediaUpload.php', { mediaUploadDetails: mediaUpload_details });
        if (response.status === 200) {
            const { status, data } = response.data
            return data;
        }
        return null;
    } catch (error) {
        console.log('Error Saving user details:', error);
        return null;
    }
}

export const saveNewRelease = async (releaseDetails: NewReleaseDetails) => {
    try {
        const response = await axiosInstance.post('artist/createNewRelease.php', { releaseDetails: releaseDetails });
        console.log(response)
        if (response.status === 200) {
            const { status, data } = response.data
            return data;
        }
        return null;
    } catch (error) {
        console.log('Error Saving user details:', error);
        return null;
    }
}

export const uploadSingleTrack = async (trackDetails: SingleTrackDetails) => {

    try {
        const response = await axiosInstance.post('artist/uploadSingleTrack_Container.php', { trackDetails });
        console.log('jim')
        console.log(response)

        if (response.status === 200) {
            const { status, data } = response.data
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

        const response = await axiosInstance.post('artist/updateTrack_File_Album_cover.php', { referenceId, fileType, awsUrl, upload_status });

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

export const searchArtistName = async (query_name: string) => {
    try {

        const response = await axiosInstance.post('artist/searchArtist.php', { query: query_name });

        const { status, data } = response.data
        console.log(data)

        return {
            status: "success",
            artist_data: data,
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

        const response = await axiosInstance.post('artist/getArtistDiscover.php', { artist_id: artist_id });

        const { status, data } = response.data
        console.log(data)

        return {
            status: "success",
            artistDiscovery: data,
        };
    } catch (error) {
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



// detail creator list of aritists
export const getDetailCreatorAritstList = async (creatorID: string, creatorRole: string) => {

  try {
        const response = await axiosInstance.post('artist/creator_artistlist_details.php', { creatorID: creatorID, creatorRole: creatorRole });
        if (response.status === 200) {
            const { status, data } = response.data
            return data;
        }
        return null;
    } catch (error) {
        console.log('Error Saving user details:', error);
        return null;
    }
  
}



// create new artist

export const CreateArtistProfile = async (artistProfile: ArtistProfile) => {
    try {
        const response = await axiosInstance.post('artist/saveArtistDetails.php', { artistDetails: artistProfile });
        if (response.status === 200) {
            const { status, data } = response.data
            return data;
        }
        return null;
    } catch (error) {
        console.log('Error Saving user details:', error);
        return null;
    }
}

// Update the artist table given artist id and profile id
export const updateArtistImages = async (artistId: string, mediaId: number, imageType: string, media_creatorID: number) => {
    try {
        const response = await axiosInstance.post('artist/updateArtistImages.php', { artistID: artistId, uploaded_mediaID: mediaId, imageType: imageType, media_creatorID });
        if (response.status === 200) {
            const { status, data } = response.data
            return data;
        }
        return null;
    } catch (error) {
        console.log('Error Saving user details:', error);
        return null;
    }
}


