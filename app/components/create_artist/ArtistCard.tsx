import React from 'react';
import { Instagram, AlignJustify as Spotify, Twitter } from 'lucide-react';
import type { Artist } from '@/types/artist';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="group flex flex-col items-center text-center p-6 border rounded-lg">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2 px-3 py-1.5 rounded-full">
          {artist.socialLinks.spotify && (
            <a
              href={artist.socialLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Spotify size={18} />
            </a>
          )}
          {artist.socialLinks.instagram && (
            <a
              href={artist.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
            </a>
          )}
          {artist.socialLinks.twitter && (
            <a
              href={artist.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={18} />
            </a>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{artist.name}</h3>
      <p className="text-sm">{artist.genre}</p>
    </div>
  );
}