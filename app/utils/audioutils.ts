import { parseBuffer } from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';
import { AudioMetadata } from '@/types/audioMetadata';


export async function generateContentId(contentType: string): Promise<string> {
    // Check content type and assign the appropriate prefix
    const prefix = contentType === "track" ? "mw_trk" : "mw_alb";
    const uniqueId = uuidv4(); // Generate a unique identifier
    return `${prefix}${uniqueId}`;
}


export async function getAudioMetadata(file: File): Promise<AudioMetadata> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await parseBuffer(buffer, file.type);

    return {
        title: metadata.common?.title || file.name,
        artist: metadata.common?.artist || '',
        album: metadata.common?.album || '',
        genre: metadata.common?.genre || [],
        duration: metadata.format?.duration || 0,
        bitrate: metadata.format?.bitrate || 0,
        sampleRate: metadata.format?.sampleRate || 0,
        lossless: metadata.format?.lossless || false,
        codec: metadata.format?.codec || '',
        year: metadata.common?.year ? metadata.common.year.toString() : '',
        track: { no: metadata.common?.track?.no ?? 0, of: metadata.common?.track?.of ?? 0 },
        disk: { no: metadata.common?.disk?.no ?? 0, of: metadata.common?.disk?.of ?? 0 },
        picture: metadata.common?.picture || [],
        native: metadata.native || {},
        quality: metadata.quality || {},
    };
}


export function formatAudioDuration(duration: string): string {
    // Check if the string can be converted to a number
    const numericDuration = parseFloat(duration);
    if (isNaN(numericDuration)) {
        return duration; // Return the string as is if it's not a number
    }

    const hours = Math.floor(numericDuration / 3600);
    const minutes = Math.floor((numericDuration % 3600) / 60);
    const secs = Math.floor(numericDuration % 60);

    const hoursStr = hours > 0 ? hours.toString() : '';
    const minutesStr = minutes.toString().padStart(hours > 0 ? 2 : 1, '0');
    const secondsStr = secs.toString().padStart(2, '0');

    return hoursStr ? `${hoursStr}:${minutesStr}:${secondsStr}` : `${minutesStr}:${secondsStr}`;
}