'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getArtistActivity } from '@/actions/dashboard/getOverview-stats'
import { Play, Users, Clock, Calendar, Crown, Music } from 'lucide-react';


function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}



export function RecentActivity({ artistID }: ArtistID) {
  const [albumData, setActivities] = useState<lastestAlbum | MessageType | any>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!artistID) return; // Ensure id is available before calling the server action
    setIsLoading(true);
    getArtistActivity(artistID)
      .then(setActivities)
      .catch(() => setError('Failed to load  data'))
      .finally(() => setIsLoading(false));
  }, [artistID]);

  if (isLoading) {
    return <RecentActivitySkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Latest Release</CardTitle>
        <CardDescription>
          Your latest release interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                  <img
                    src={albumData.artworkPath}
                    alt={albumData.title}
                    className="w-32 h-32 rounded-lg shadow-2xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{albumData.title}</h1>
                      {albumData.exclusive === 1 && (
                        <Crown className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-lg text-gray-400 mt-2">{albumData.artistName}</p>
                    <div className="flex items-center gap-2 mt-4 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Release Date: {formatDate(albumData.releaseDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm text-gray-400">Total Plays</h3>
                    </div>
                    <p className="text-xl font-bold">{albumData.performance.albumTotalPlays}</p>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-green-400" />
                      <h3 className="text-sm text-gray-400">Unique Listeners</h3>
                    </div>
                    <p className="text-xl font-bold">{albumData.performance.albumUniqueListeners}</p>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm text-gray-400">Avg. Listen Duration</h3>
                    </div>
                    <p className="text-xl font-bold">{formatDuration(albumData.performance.avgListenDurationPerTrack)}</p>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-4 h-4 text-pink-400" />
                      <h3 className="text-sm text-gray-400">Tracks</h3>
                    </div>
                    <p className="text-xl font-bold">{albumData.tracks.length}</p>
                  </div>
                </div>

                {/* Tracks Table */}
                <div>
                  <h2 className="text-lg font-bold mb-4">Track Performance</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b">
                          <th className="pb-3 text-sm">Title</th>
                          <th className="pb-3 text-sm">Plays</th>
                          <th className="pb-3 text-sm">Unique Listeners</th>
                          <th className="pb-3 text-sm">Avg. Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {albumData.tracks.map((track: any) => (
                          <tr key={track.songTitle} className="border-b">
                            <td className="py-3 text-sm">{track.songTitle}</td>
                            <td className="py-3 text-sm">{track.totalPlays}</td>
                            <td className="py-3 text-sm">{track.uniqueListeners}</td>
                            <td className="py-3 text-sm">{formatDuration(track.avgListenDuration)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivitySkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="h-6 w-1/4 bg-accent" />
        <Skeleton className="h-4 w-1/2 mt-2 bg-accent" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-9 w-9 rounded-full bg-accent" />
              <div className="ml-4 space-y-1">
                <Skeleton className="h-4 w-[150px] bg-accent" />
                <Skeleton className="h-4 w-[100px] bg-accent" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

