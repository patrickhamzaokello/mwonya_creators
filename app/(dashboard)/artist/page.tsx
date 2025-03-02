"use client";
import { useEffect, useState } from 'react'
import { Music2 } from 'lucide-react';
import { AddArtistCard } from '@/components/create_artist/AddArtistCard';
import { ArtistCard } from '@/components/create_artist/ArtistCard';
import { AddArtistDialog } from '@/components/create_artist/AddArtistDialog';
import type { Artist } from '@/types/artist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { listCreatorArtists } from '@/actions/dashboard/artist_actions';

function App() {
  const [artists, setArtists] = useState<Artist[] | MessageType>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = () => {
    setIsLoading(true);
    listCreatorArtists()
      .then((creator_artist) => {
        setArtists(creator_artist);
      })
      .catch((err) => {
        setError('Failed to load data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSaveArtist = (newArtist: Omit<Artist, 'id'>) => {
    setIsDialogOpen(false); // Close the dialog first
    fetchData(); // Refetch the artists list
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <OverViewSkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen">
      <main className="">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AddArtistCard onClick={() => setIsDialogOpen(true)} />
          {Array.isArray(artists) && artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </main>

      <AddArtistDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveArtist}
      />
    </div>
  );
}

function OverViewSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32 bg-accent" />
            <Skeleton className="h-4 w-48 mt-2 bg-accent" />
          </div>
          <Skeleton className="h-10 w-32 bg-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full bg-accent" />
      </CardContent>
    </Card>
  )
}

export default App;