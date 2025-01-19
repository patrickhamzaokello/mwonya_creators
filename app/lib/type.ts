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


interface UploadTrackDetails {
    reference_id: string;
    title: string;
    artist: string;
    album: string;
    genre: number;
    upload_id: number;
    duration: number;
    tag: string;
    metadata: string; // JSON string
    releasedate: string; // ISO date string
}


interface MediaUploadDetails {
    user_id: string;
    upload_type: string;
    file_path: string;
    file_name: string;
    file_hash: string;
    file_size: number;
    file_format: string;
    metadata: string; // JSON string
    is_active: number;
}


interface NewReleaseDetails {
    releaseID: string;
    artist: string;
    release_title: string;
    genre: number;
    releaseType: string;
    exclusive: number;
    tags: string;
    description: string;
    releaseDate: string;
    aesCode: string;
}


interface SingleTrackDetails {
    album_id: string;
    track_reference: string,
    title: string;
    artist: string;
    album_title: string;
    genre: number;
    duration: number;
    exclusive: number;
    tag: string;
    producer: string;
    songwriter: string;
    labels: string;
    description: string;
    releaseDate: string;
    AES_code: string;
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



interface OverviewData {
    title: string
    value: string
    change: { amount: string, percentage: string }
    lastUpdated: string
    trend: string
}


interface ArtistID {
    artistID: string
}


interface MonthlyData {
    name: string
    total: number
}

interface Song {
    song_id: number,
    song_title: string
    album_name: string
    album_cover: string
    genre_name: string
    artist_name: string
    total_plays: string
}



interface Activity {
    type: string
    title: string
    description: string
    avatar: string
}

interface PayoutData {
    amount: number
    date: string
}