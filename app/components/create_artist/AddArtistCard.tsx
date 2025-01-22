import React from 'react';
import { PlusCircle } from 'lucide-react';

interface AddArtistCardProps {
  onClick: () => void;
}

export function AddArtistCard({ onClick }: AddArtistCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center text-center p-6"
    >
      <div className="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center mb-4">
        <PlusCircle size={48} />
      </div>
      <span className="text-lg font-semibold">Add New Artist</span>
    </button>
  );
}