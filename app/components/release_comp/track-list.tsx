'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TrackRow } from './track-row'
import { getContentDetails } from '@/actions/getArtists'

interface Track {
  title: string
  duration: string
  trackFilePath: string
  explicit?: boolean
}

export function TrackList({ id }: { id: string }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const response = await getContentDetails(id)
      setTracks(response.content_info.tracks || [])
    }
    fetchContent()
  }, [id])

  const handlePlayToggle = (index: number) => {
    if (currentTrack === index) {
      setIsPlaying(!isPlaying)
      isPlaying ? audioRef.current?.pause() : audioRef.current?.play()
    } else {
      setCurrentTrack(index)
      setIsPlaying(true)
      if (audioRef.current) {
        audioRef.current.src = tracks[index].trackFilePath
        audioRef.current.play()
      }
    }
  }

  const calculateTotalDuration = (tracks: Track[]): string => {
    // Add actual duration calculation logic here
    return "1 hr 23 min"
  }

  return (
    <div className="lg:col-span-2">
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="text-lg font-semibold">Tracks</h3>
            <p className="text-sm text-muted-foreground">
              {tracks.length} songs, {calculateTotalDuration(tracks)}
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Track
          </Button>
        </div>

        <div className="divide-y">
          {tracks.map((track, index) => (
            <TrackRow
              key={index}
              track={track}
              index={index}
              isPlaying={currentTrack === index && isPlaying}
              onPlayToggle={() => handlePlayToggle(index)}
              audioRef={audioRef}
            />
          ))}
        </div>
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  )
}

