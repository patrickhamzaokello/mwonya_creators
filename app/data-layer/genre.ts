import axiosInstance from "@/lib/axiosInstance";

export const getAllGenre = async (trackType: string) => {
    try {

        const response = await axiosInstance.post('/artist/getGenre.php', { trackType: trackType });
        const { status, data } = response.data
       
        return {
            status: "success",
            genres: data,
        };
    } catch (error) {
        return {
            status: "error",
            message: "Fetch Error Has occured",
        };
    }
}