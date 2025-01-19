export interface AudioMetadata {
    title: string;
    artist: string;
    album: string;
    genre: string[];
    duration: number;
    bitrate: number;
    sampleRate: number;
    lossless: boolean;
    codec: string;
    year: string;
    track: { no: number; of: number };
    disk: { no: number; of: number };
    picture: any[];
    native: Record<string, any>;
    quality: Record<string, any>;
}