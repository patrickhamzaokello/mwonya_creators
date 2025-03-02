"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import AudioWaveformPlayer from "@/components/AudioWaveformPlayer";
import MediaGrid from './MediaGrid';
import { deleteMedia } from './actions';
import { Upload } from 'lucide-react';
import { getUploadMedias } from '@/data-layer/uploads';

interface MediaDescription {
    id: string;
    content: string;
    mediaId: string;
    createdAt: string;
}

interface MediaUpload {
    id: string;
    type: 'image' | 'audio';
    userId: string;
    fileUrl: string;
    createdAt: string;
    mediaDescriptions: MediaDescription[];
}
interface Error {
    success: boolean;
    message: string;
}
export default function MediaList() {
    const [mediaUploads, setMediaUploads] = useState<MediaUpload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchMediaUploads();
    }, []);

    const fetchMediaUploads = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/uploadList/');
            if (!response.ok) {
                setError({ success: false, message:'Failed to fetch media uploads'});
            }
            const data = await response.json();
            setMediaUploads(data);
        } catch (error) {
            setError({ success: false, message: 'Failed to fetch media uploads. Please try again later.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (uploadToDelete: MediaUpload) => {
        const result = await deleteMedia(uploadToDelete.mediaDescriptions[0].id);
        if (result.success) {
            // Update the state to remove the deleted media upload
            setMediaUploads(prevUploads => prevUploads.filter(upload => upload.id !== uploadToDelete.id));
            setError(result);
        } else {
            setError(result);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <MediaGrid error={error || undefined} mediaUploads={mediaUploads} onDelete={handleDelete} />
    );
}