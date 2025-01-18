'use client'

import { useState, useEffect, useRef } from 'react'
import { Howl } from 'howler'
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
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState('0:00')
    const howlRef = useRef<Howl | null>(null)
    const [isLoading, setIsLoading] = useState(false)



    const cleanup = () => {
        if (howlRef.current) {
          howlRef.current.stop()
          howlRef.current.unload()
          howlRef.current = null
        }
        setIsPlaying(false)
        setCurrentTrack(null)
        setProgress(0)
        setCurrentTime('0:00')
        setIsLoading(false)
      }

      useEffect(() => {
        return () => cleanup()
      }, [id])


      useEffect(() => {
        const fetchContent = async () => {
            cleanup() // Cleanup before fetching new album
            const response = await getContentDetails(id)
            setTracks(response.content_info.tracks || [])
        }
        fetchContent()
    }, [id])

    const initializeHowl = (index: number) => {
        if (howlRef.current) {
            howlRef.current.stop()
            howlRef.current.unload()
        }

        setIsLoading(true)

        howlRef.current = new Howl({
            src: [tracks[index].trackFilePath],
            html5: true,
            onload: () => {
                setIsLoading(false)
                howlRef.current?.play()
            },
            onplay: () => setIsPlaying(true),
            onpause: () => setIsPlaying(false),
            onstop: () => {
                setIsPlaying(false)
                setProgress(0)
                setCurrentTime('0:00')
            },
            onend: () => {
                setIsPlaying(false)
                setProgress(0)
                setCurrentTime('0:00')
            },
            onseek: () => {
                if (howlRef.current) {
                    const seek = howlRef.current.seek() as number
                    const duration = howlRef.current.duration()
                    setProgress((seek / duration) * 100)
                    setCurrentTime(formatTime(seek))
                }
            },
        })
    }

    const handlePlayToggle = (index: number) => {
        if (currentTrack === index) {
            if (isPlaying) {
                howlRef.current?.pause()
            } else {
                howlRef.current?.play()
            }
        } else {
            setCurrentTrack(index)
            initializeHowl(index)
        }
    }

    // Handle progress updates
    useEffect(() => {
        let progressInterval: NodeJS.Timeout | null = null

        if (isPlaying && howlRef.current) {
            progressInterval = setInterval(() => {
                if (howlRef.current) {
                    const seek = howlRef.current.seek() as number
                    const duration = howlRef.current.duration()
                    setProgress((seek / duration) * 100)
                    setCurrentTime(formatTime(seek))
                }
            }, 1000)
        }

        return () => {
            if (progressInterval) {
                clearInterval(progressInterval)
            }
        }
    }, [isPlaying])

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const calculateTotalDuration = (tracks: Track[]): string => {
        // Add actual duration calculation logic here
        return "1 hr 23 min"
    }

    const handleSeek = (index: number, percent: number) => {
        if (currentTrack === index && howlRef.current) {
            const duration = howlRef.current.duration();
            howlRef.current.seek(duration * (percent / 100));
        }
    };

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
                            progress={currentTrack === index ? progress : 0}
                            currentTime={currentTrack === index ? currentTime : '0:00'}
                            onSeek={(percent) => handleSeek(index, percent)}
                            isLoading={currentTrack === index && isLoading}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

