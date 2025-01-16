'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getArtistTopSongs } from '@/actions/dashboard/getOverview-stats'
import {TopTracks} from './top-tracks-card'



export function TopSongs({ artistID }: ArtistID) {
  const [songs, setSongs] = useState<Song[] | MessageType | any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!artistID) return; // Ensure id is available before calling the server action
    setIsLoading(true);

    getArtistTopSongs(artistID)
      .then(setSongs)
      .catch(() => setError('Failed to load  data'))
      .finally(() => setIsLoading(false));
  }, [artistID]);

  if (isLoading) {
    return <TopSongsSkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }


  return (
    <>
    
    <TopTracks songs={songs} />

    </>
  )

}

function TopSongsSkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="ml-4 space-y-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
              <Skeleton className="h-4 w-[20px] ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

