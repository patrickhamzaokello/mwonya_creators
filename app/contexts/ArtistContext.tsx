"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';



const ArtistContext = createContext<TArtistContextType | undefined>(undefined);

export function ArtistProvider({ children }: { children: ReactNode }) {
  const [selectedArtist, setSelectedArtist] = useState<TArtist | null>(null);

  return (
    <ArtistContext.Provider value={{ selectedArtist, setSelectedArtist }}>
      {children}
    </ArtistContext.Provider>
  );
}

export function useArtist():[TArtist | null, (artist: TArtist | null) => void] {
  const context = useContext(ArtistContext);
  if (context === undefined) {
    throw new Error('useArtist must be used within an ArtistProvider');
  }
  return [context.selectedArtist, context.setSelectedArtist];
}