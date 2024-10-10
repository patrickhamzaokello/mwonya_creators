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


type TStringMap = {
    [key: string]: string;
}
type TStringToBooleanMap = {
    [key: string]: string;
}