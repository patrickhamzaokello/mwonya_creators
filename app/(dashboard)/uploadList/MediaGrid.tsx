import React from 'react';
import Image from 'next/image';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};


const MediaCard = ({ upload, onDelete }) => (
    <div key={upload.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-4 flex items-center space-x-4">
        {upload.type === 'image' && (
            <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                    src={upload.fileUrl}
                    alt="Uploaded media"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                />
            </div>
        )}
        {upload.type === "audio" && (
            <audio className="w-24 h-24 flex-shrink-0" controls>
                <source src={upload.fileUrl} type="audio/mpeg" />
            </audio>
        )}
        {upload.type === "video" && (
            <video className="w-24 h-24 flex-shrink-0 rounded-md" controls>
                <source src={upload.fileUrl} type="video/mp4" />
            </video>
        )}
        {!['image', 'audio', 'video'].includes(upload.type) && (
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
            </div>
        )}
        <div className="flex-grow">
            <p className="text-xs text-gray-500 mb-1">
                Uploaded on {formatDate(upload.createdAt)}
            </p>
            {upload.mediaDescriptions.length > 0 && (
                <p className="text-sm font-medium mb-1 line-clamp-2">
                    {upload.mediaDescriptions[0].content}
                </p>
            )}
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{upload.type}</span>
                <button
                    onClick={() => onDelete(upload)}
                    className="text-red-500 text-xs hover:text-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

const MediaGrid = ({error, mediaUploads, onDelete }) => (
    <div>
    {error && (
        <div className={`p-4 mb-4 rounded-lg ${error.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {error.message}
    </div>
    )} {
    <div className="grid grid-cols-1 gap-4">
        {mediaUploads.length === 0 ? (
            <p className="text-gray-500 text-center">No media uploads found.</p>
        ) : (
            mediaUploads.map(upload => (
                <MediaCard key={upload.id} upload={upload} onDelete={onDelete} />
            ))
        )}
    </div>
    }
    </div>
);

export default MediaGrid;