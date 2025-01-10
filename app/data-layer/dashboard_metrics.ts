import axiosInstance from "@/lib/axiosInstance";
export const getArtistMetrisx = async (referenceId: string): Promise<OverviewData | MessageType> => {
    try {

        await new Promise(resolve => setTimeout(resolve, 500))
        const metrics = {
            totalStreams: 1324789,
            streamsLastmonth: "+20.1% from last month",
            totalEarnings: 15231.89,
            totalEarningsLastmonth: "+18.7% from last month",
            activeListeners: 573281,
            activeListenersLastmonth: "+10.5% from last month",
            newReleases: 3,
            newReleasesLastmonth: "In the last 30 days"
        }


        return metrics;
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }

};

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


export const fetchArtistActivities = async (artistID: string): Promise<Activity[] | MessageType> => {
    try {

        await new Promise(resolve => setTimeout(resolve, 500))
        const data = [
            {
                type: "johnny",
                title: "welcome",
                description: "there to",
                avatar: "/exmaple.omng"
            },
            {
                type: "johnny",
                title: "welcome",
                description: "there to",
                avatar: "/exmaple.omng"
            },
            {
                type: "johnny",
                title: "welcome",
                description: "there to",
                avatar: "/exmaple.omng"
            },
            {
                type: "johnny",
                title: "welcome",
                description: "there to",
                avatar: "/exmaple.omng"
            },
            {
                type: "johnny",
                title: "welcome",
                description: "there to",
                avatar: "/exmaple.omng"
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


export const fetchArtistTopSongs = async (artistID: string): Promise<Song[] | MessageType> => {
    try {

        await new Promise(resolve => setTimeout(resolve, 500))
        const data = [
            {
                name: "Jan",
                streams: "234",
                image: "/exmaple.omng"
            },
            {
                name: "Jan",
                streams: "234",
                image: "/exmaple.omng"
            },
            {
                name: "Jan",
                streams: "234",
                image: "/exmaple.omng"
            },
            {
                name: "Jan",
                streams: "234",
                image: "/exmaple.omng"
            }
        ]

        return data;
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
}


export const fetchmonthlyData = async (artistID: string): Promise<MonthlyData[] | MessageType> => {
    try {

        const response = await axiosInstance.post('/artist/getTotalPlayTrend.php', { artistID: artistID, year: "2024" });
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