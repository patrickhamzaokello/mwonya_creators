"use server";
import { getAllGenre } from "@/data-layer/genre";

export const retrieveAllGenres = async () => {
    try {
        const fetchedgenres = await getAllGenre();

        if (fetchedgenres) {
            return { status: "success", message: "Retrived Genre Successfully",fetchedgenres };
        } else {
            return { status: "error", message: "Failed to get any genre details",fetchedgenres };
        }

    } catch (error) {
        return {
            status: "error",
            message: `Error creating artist profile: ${error}`,
        };
    }
}