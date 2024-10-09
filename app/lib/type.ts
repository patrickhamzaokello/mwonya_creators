type MessageType = {
    status: "success" | "error";
    message: string;
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

type TArtistContextType = {
    selectedArtist: TArtist | null;
    setSelectedArtist: (artist: TArtist | null) => void;
}