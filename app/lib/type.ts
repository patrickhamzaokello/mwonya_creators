type MessageType = {
    status: "success" | "error";
    message: string;
};

type CreateAristFormState<T> = {
    status: "success" | "error";
    errors?: TStringMap;
    message?: string;
    data?: T;
    blurs?: TStringToBooleanMap;
};

type TArtist = {
    id: string;
    name: string;
    profileImage: string;
    coverImage: string;
    genreID: string;
    genreName: string;
    verified: boolean;
    followers: string;
    shortbio: string;
}

type TMediaUploadDescription = {
    content: string
    mediaId?: string
}

type TArtistContextType = {
    selectedArtist: TArtist | null;
    setSelectedArtist: (artist: TArtist | null) => void;
}


interface ContentItem {
    content_id: string;
    title: string;
    artist: string;
    imageUrl: string;
    category: string;
}

interface YearSection {
    year: number
    items: ContentItem[]
}

interface ContentDetails extends ContentItem {
    description: string
    releaseDate: string
    duration: string
    tracks?: {
        title: string
        duration: string
    }[]
}



type TStringMap = {
    [key: string]: string;
}
type TStringToBooleanMap = {
    [key: string]: string;
}

type Track = {
    title: string;
    duration: string; // Format: "MM:SS"
};

type AlbumContent = {
    content_id: string;
    title: string;
    artist: string; // E.g., "Various Artists"
    imageUrl: string; // URL to the album artwork
    category: string; // Genre or category, e.g., "Pop"
    description: string; // Brief description of the album
    releaseDate: string; // Format: "YYYY-MM-DD"
    duration: string; // Total duration in a readable format, e.g., "1h 12m"
    tracks: Track[]; // List of tracks in the album
};
