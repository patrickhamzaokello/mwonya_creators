'use client'
import TrackUploadForm from '@/components/contentUploadForms/TrackUploadForm'
import { Toaster } from "@/components/ui/toaster"
import { useArtist } from "@/contexts/ArtistContext";
import { useState, useEffect } from "react";

export default function UploadPage() {
  const [selectedArtist, setSelectedArtist] = useArtist();
  const [artistName, setArtistName] = useState<string | undefined>();
  const [artistID, setArtistID] = useState<string | undefined>();

  useEffect(() => {
    if (!selectedArtist) {
      // Reset states when no artist is selected
      setArtistID(undefined);
      setArtistName(undefined);
      return;
    }

    setArtistID(selectedArtist.id);
    setArtistName(selectedArtist.name);
  }, [selectedArtist]);

  if (!selectedArtist) {
    return (
      <section className="w-full max-w-4xl mx-auto py-10 md:py-16 lg:py-10 min-h-screen bg-background">
        <div className="px-4 sm:px-6 md:px-8 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            No Artist Selected
          </h2>
          <p className="text-muted-foreground">
            Please select an artist to upload tracks.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto py-10 md:py-16 lg:py-10 min-h-screen bg-background">
      <div className="px-4 sm:px-6 md:px-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Upload a New Track for {artistName}
          </h2>
          <p className="text-muted-foreground">
            Fill out the details below to add a new track. ID {artistID}
          </p>
        </div>
        {artistID && artistName && (
          <TrackUploadForm artistId={artistID} artistName={artistName} />
        )}
        <Toaster />
      </div>
    </section>
  )
}