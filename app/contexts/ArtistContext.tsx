"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ArtistContextType {
  selectedArtist: string | null;
  setSelectedArtist: (artist: string | null) => void;
}

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export function ArtistProvider({ children }: { children: ReactNode }) {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  return (
    <ArtistContext.Provider value={{ selectedArtist, setSelectedArtist }}>
      {children}
    </ArtistContext.Provider>
  );
}

export function useArtist():[string | null, (artist: string | null) => void] {
  const context = useContext(ArtistContext);
  if (context === undefined) {
    throw new Error('useArtist must be used within an ArtistProvider');
  }
  return [context.selectedArtist, context.setSelectedArtist];
}