"use server";

import { getAllGenre } from "@/data-layer/genre";

export const retrieveAllGenres = async (trackType: string) => {
    console.log(`Retrieving genres for track type: ${trackType}`);

    try {
        const result = await getAllGenre(trackType);

        if (result.status === "success" && Array.isArray(result.genres)) {
            let filteredGenres = result.genres;

            console.log(trackType)

            // Filter genres if trackType is 'episode' or 'podcast'
            if (trackType === 'episode' || trackType === 'podcast') {
                console.log('Filtering genres for episode or podcast track type');
                filteredGenres = result.genres.filter(genre => genre.tag === 'other');
            } else {
                // Exclude genres tagged as 'other' for default trackType 'music'
                filteredGenres = result.genres.filter(genre => genre.tag !== 'other');
            }

            const formattedGenres = filteredGenres.map(genre => ({
                id: genre.id.toString(),
                name: genre.name
            }));

            return {
                status: "success",
                message: "Retrieved genres successfully",
                fetchedgenres: {
                    genres: formattedGenres
                }
            };
        } else {
            return {
                status: "error",
                message: "Failed to get genre details: Unexpected data structure",
                fetchedgenres: {
                    genres: []
                }
            };
        }
    } catch (error) {
        return {
            status: "error",
            message: `Error fetching genres: ${error instanceof Error ? error.message : 'Unknown error'}`,
            fetchedgenres: {
                genres: []
            }
        };
    }
}

