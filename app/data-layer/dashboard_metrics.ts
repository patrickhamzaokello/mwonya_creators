import axiosInstance from "@/lib/axiosInstance";
import { MetricItemProps } from "@/types/artist";
export const getArtistMetrisx = async (referenceId: string, keyMetrics: string[]): Promise<OverviewData[] | MessageType> => {
    try {
        // should pass the list of metrics i want
        const response = await axiosInstance.post('/artist/getArtistMetrics.php', { artistID: referenceId, keyMetrics: keyMetrics });
        const { status, data } = response.data

        if (status === "success") {
            return data;
        }
        return data;

    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }

};


export const fetchArtistTopSongs = async (artistID: string): Promise<Song[] | MessageType> => {
    try {

        // should pass the list of metrics i want
        const response = await axiosInstance.post('/artist/getArtistTopTracks.php', { artistID: artistID });
        const { status, data } = response.data

        if (status === "success") {
            return data;
        }

        return data;

    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
}

export const fetchArtistPaymentDate = async (artistID: string): Promise<PayoutData[] | MessageType> => {
    try {

        await new Promise(resolve => setTimeout(resolve, 500))
        const data = [
            {
                amount: 2334,
                date: "2025-07-01",
            },
            {
                amount: 2340,
                date: "2025-07-01",
            },
            {
                amount: 2340,
                date: "2025-07-01",
            },
        ]

        return data;
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
}


export const fetchArtistActivities = async (artistID: string): Promise<lastestAlbum | MessageType> => {
    try {

        // should pass the list of metrics i want
        const response = await axiosInstance.post('/artist/getArtistLastRelease.php', { artist_id: artistID });
        const { status, data } = response.data

        if (status === "success") {
            return data;
        }

        return data;

    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
}


export const fetchArtistSummaryData = async (artistID: string, isVerified: boolean): Promise<MetricItemProps[] | MessageType> => {
    try {

        const response = await axiosInstance.post('/artist/getArtistLivedata.php', { artistID: artistID, isVerified: isVerified });
        const { status, data } = response.data

        if (status === "success") {
            return data;
        }
        return data;
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
}


export const fetchmonthlyData = async (artistID: string, months_number: number): Promise<MonthlyData[] | MessageType> => {
    try {

        const response = await axiosInstance.post('/artist/getTotalPlayTrend.php', { artistID: artistID, months: months_number });
        const { status, data } = response.data

        if (status === "success") {
            return data;
        }
        return data;
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
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